import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AuthRow, Store } from "./store-types";
import type { AdminEnquiry, Creator, Enquiry, PublicCreator } from "./types";

const PUBLIC_COLS =
  "id,handle,instagram_url,display_name,city,niche,languages,audience,video_types,best_reel_url,ambition,deal_types,price_reel,followers,created_at";
const CREATOR_COLS = PUBLIC_COLS + ",verify_code,status,verified_at";
const ENQ_COLS =
  "id,creator_id,contact_name,brand_name,phone,email,business_type,budget_band,message,status,agreed_price,created_at,status_changed_at";

let client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Supabase is not configured");
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}

function ok<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

function fail(res: { error: { message: string } | null }) {
  if (res.error) throw new Error(res.error.message);
}

/** Keep letters, digits and a few safe characters so the value can't break the PostgREST filter syntax. */
function safeTerm(s: string) {
  return s.replace(/[^\p{L}\p{N}._ -]/gu, "").trim().slice(0, 40);
}

export function supabaseStore(): Store {
  return {
    async listVerified(opts) {
      let q = db().from("creators").select(PUBLIC_COLS).eq("status", "verified");
      if (opts.niche) q = q.eq("niche", opts.niche);
      const term = opts.q ? safeTerm(opts.q) : "";
      if (term) q = q.or(`handle.ilike.%${term}%,display_name.ilike.%${term}%`);
      const sort = opts.sort ?? "followers";
      if (sort === "price") q = q.order("price_reel", { ascending: true, nullsFirst: false });
      else if (sort === "new") q = q.order("created_at", { ascending: false });
      else q = q.order("followers", { ascending: false, nullsFirst: false });
      q = q.order("created_at", { ascending: false });
      if (opts.limit) q = q.limit(opts.limit);
      return ok(await q) as unknown as PublicCreator[];
    },
    async getVerifiedByHandle(handle) {
      const res = await db()
        .from("creators")
        .select(PUBLIC_COLS)
        .eq("status", "verified")
        .eq("handle", handle.toLowerCase())
        .maybeSingle();
      return ok(res) as unknown as PublicCreator | null;
    },
    async getCreator(id) {
      const res = await db().from("creators").select(CREATOR_COLS).eq("id", id).maybeSingle();
      return ok(res) as unknown as Creator | null;
    },
    async getAuthByHandle(handle): Promise<AuthRow | null> {
      const res = await db()
        .from("creators")
        .select("id,handle,password_hash,failed_logins,locked_until")
        .eq("handle", handle.toLowerCase())
        .maybeSingle();
      return ok(res) as unknown as AuthRow | null;
    },
    async createCreator(input) {
      const res = await db()
        .from("creators")
        .insert({
          handle: input.handle.toLowerCase(),
          instagram_url: input.instagram_url,
          display_name: input.display_name,
          password_hash: input.password_hash,
          verify_code: input.verify_code,
        })
        .select("id")
        .single();
      if (res.error) {
        if (res.error.code === "23505") return { ok: false, reason: "handle_taken" };
        throw new Error(res.error.message);
      }
      return { ok: true, id: (res.data as { id: string }).id };
    },
    async registerLoginFailure(id) {
      const cur = ok(await db().from("creators").select("failed_logins").eq("id", id).maybeSingle()) as {
        failed_logins: number;
      } | null;
      if (!cur) return;
      const n = cur.failed_logins + 1;
      const patch =
        n >= 8
          ? { failed_logins: 0, locked_until: new Date(Date.now() + 15 * 60_000).toISOString() }
          : { failed_logins: n };
      fail(await db().from("creators").update(patch).eq("id", id));
    },
    async clearLoginFailures(id) {
      fail(await db().from("creators").update({ failed_logins: 0, locked_until: null }).eq("id", id));
    },
    async updateProfile(id, input) {
      fail(await db().from("creators").update(input).eq("id", id));
    },
    async createEnquiry(e) {
      fail(await db().from("enquiries").insert(e));
    },
    async countRecentEnquiriesByIp(ipHash, sinceIso) {
      const res = await db()
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", sinceIso);
      if (res.error) throw new Error(res.error.message);
      return res.count ?? 0;
    },
    async listEnquiries(creatorId) {
      const res = await db()
        .from("enquiries")
        .select(ENQ_COLS)
        .eq("creator_id", creatorId)
        .order("created_at", { ascending: false })
        .limit(500);
      return ok(res) as unknown as Enquiry[];
    },
    async countNewEnquiries(creatorId) {
      const res = await db()
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", creatorId)
        .eq("status", "new");
      if (res.error) throw new Error(res.error.message);
      return res.count ?? 0;
    },
    async updateEnquiry(creatorId, enquiryId, status, agreedPrice) {
      fail(
        await db()
          .from("enquiries")
          .update({ status, agreed_price: agreedPrice, status_changed_at: new Date().toISOString() })
          .eq("id", enquiryId)
          .eq("creator_id", creatorId),
      );
    },
    async adminListCreators() {
      const res = await db().from("creators").select(CREATOR_COLS).order("created_at", { ascending: false }).limit(1000);
      return ok(res) as unknown as Creator[];
    },
    async adminSetStatus(id, status, followers) {
      const patch: Record<string, unknown> = {
        status,
        verified_at: status === "verified" ? new Date().toISOString() : null,
      };
      if (followers != null) patch.followers = followers;
      fail(await db().from("creators").update(patch).eq("id", id));
    },
    async adminSetFollowers(id, followers) {
      fail(await db().from("creators").update({ followers }).eq("id", id));
    },
    async adminDeleteCreator(id) {
      fail(await db().from("creators").delete().eq("id", id));
    },
    async adminListEnquiries(limit) {
      const res = await db()
        .from("enquiries")
        .select(ENQ_COLS + ",creators(display_name,handle)")
        .order("created_at", { ascending: false })
        .limit(limit);
      const rows = ok(res) as unknown as Array<
        Enquiry & { creators: { display_name: string; handle: string } | { display_name: string; handle: string }[] | null }
      >;
      return rows.map((r) => {
        const c = Array.isArray(r.creators) ? r.creators[0] : r.creators;
        const { creators: _c, ...enq } = r;
        void _c;
        return { ...enq, creator_name: c?.display_name ?? "?", creator_handle: c?.handle ?? "?" } as AdminEnquiry;
      });
    },
  };
}
