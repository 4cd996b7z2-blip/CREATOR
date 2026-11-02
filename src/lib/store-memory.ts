// In-memory database used ONLY for local testing (USE_MOCK_DB=1, never on a live host).
import bcrypt from "bcryptjs";
import type { AuthRow, Store } from "./store-types";
import type { Creator, Enquiry, ListOpts, PublicCreator } from "./types";

type CreatorRow = Creator & { password_hash: string; failed_logins: number; locked_until: string | null };
type EnquiryRow = Enquiry & { ip_hash: string };
type DB = { creators: CreatorRow[]; enquiries: EnquiryRow[] };

const g = globalThis as unknown as { __rcMem?: DB };

function uid() {
  return crypto.randomUUID();
}

function seed(): DB {
  const hash = bcrypt.hashSync("demo1234", 4);
  const daysAgo = (d: number) => new Date(Date.now() - d * 86400_000).toISOString();
  const mk = (
    handle: string,
    display_name: string,
    niche: string,
    followers: number | null,
    price: number | null,
    extra: Partial<CreatorRow> = {},
  ): CreatorRow => ({
    id: uid(),
    handle,
    instagram_url: `https://instagram.com/${handle}`,
    display_name,
    city: "Rajkot",
    niche,
    languages: ["gu", "hi"],
    audience: "Mostly 18 to 30 year olds from Rajkot and nearby towns",
    video_types: ["reels", "review"],
    best_reel_url: `https://instagram.com/reel/demo-${handle}`,
    ambition: "I want to work with big local brands",
    deal_types: ["paid", "barter"],
    price_reel: price,
    followers,
    created_at: daysAgo(12),
    verify_code: "RC-" + handle.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "X").padEnd(4, "X") + "2",
    status: "verified",
    verified_at: daysAgo(10),
    password_hash: hash,
    failed_logins: 0,
    locked_until: null,
    ...extra,
  });
  const creators = [
    mk("rajkot_foodie", "Hardik Vyas", "food", 48200, 5000, { video_types: ["reels", "review", "vlog"] }),
    mk("styled_by_nidhi", "Nidhi Joshi", "fashion", 31500, 4000, { languages: ["gu", "en"] }),
    mk("gymwithjay", "Jay Parmar", "fitness", 22800, 3000, { deal_types: ["paid"] }),
    mk("rajkotvlogs", "Krunal Bhatt", "lifestyle", 86400, 9000, { video_types: ["vlog", "reels", "event"] }),
    mk("glam.by.riya", "Riya Desai", "beauty", 15700, 2500),
    mk("techwith_dhruv", "Dhruv Mehta", "tech", 12400, null, { languages: ["en", "hi"] }),
    mk("new_creator_demo", "Aarav Shah", "comedy", null, null, {
      status: "pending",
      verified_at: null,
      best_reel_url: null,
      verify_code: "RC-K7M4P",
      created_at: daysAgo(0),
    }),
  ];
  const first = creators[0];
  const enquiries: EnquiryRow[] = [
    {
      id: uid(),
      creator_id: first.id,
      contact_name: "Meet Patel",
      brand_name: "Chai Tapri Cafe",
      phone: "9876543210",
      email: null,
      business_type: "cafe",
      budget_band: "5k-15k",
      message: "We are opening a new branch at Kalawad Road. Need 1 reel for the opening day.",
      status: "new",
      agreed_price: null,
      created_at: daysAgo(0),
      status_changed_at: null,
      ip_hash: "seed1",
    },
    {
      id: uid(),
      creator_id: first.id,
      contact_name: "Pooja Rathod",
      brand_name: "Pooja Bakery",
      phone: "9123456780",
      email: "pooja@example.com",
      business_type: "shop",
      budget_band: "under5k",
      message: "Diwali sweets box promotion.",
      status: "contacted",
      agreed_price: null,
      created_at: daysAgo(2),
      status_changed_at: daysAgo(1),
      ip_hash: "seed2",
    },
  ];
  return { creators, enquiries };
}

function db(): DB {
  if (!g.__rcMem) g.__rcMem = seed();
  return g.__rcMem;
}

function toPublic(c: CreatorRow): PublicCreator {
  return {
    id: c.id,
    handle: c.handle,
    instagram_url: c.instagram_url,
    display_name: c.display_name,
    city: c.city,
    niche: c.niche,
    languages: c.languages,
    audience: c.audience,
    video_types: c.video_types,
    best_reel_url: c.best_reel_url,
    ambition: c.ambition,
    deal_types: c.deal_types,
    price_reel: c.price_reel,
    followers: c.followers,
    created_at: c.created_at,
  };
}

function toCreator(c: CreatorRow): Creator {
  return { ...toPublic(c), verify_code: c.verify_code, status: c.status, verified_at: c.verified_at };
}

function toEnquiry(e: EnquiryRow): Enquiry {
  const { ip_hash: _ip, ...rest } = e;
  void _ip;
  return rest;
}

const nullsLast = (a: number | null, b: number | null, dir: 1 | -1) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return (a - b) * dir;
};

export function memoryStore(): Store {
  return {
    async listVerified(opts: ListOpts) {
      let rows = db().creators.filter((c) => c.status === "verified");
      if (opts.niche) rows = rows.filter((c) => c.niche === opts.niche);
      if (opts.q) {
        const q = opts.q.toLowerCase();
        rows = rows.filter((c) => c.handle.includes(q) || c.display_name.toLowerCase().includes(q));
      }
      const sort = opts.sort ?? "followers";
      rows = [...rows].sort((a, b) => {
        if (sort === "price") return nullsLast(a.price_reel, b.price_reel, 1);
        if (sort === "new") return b.created_at.localeCompare(a.created_at);
        return nullsLast(a.followers, b.followers, -1);
      });
      if (opts.limit) rows = rows.slice(0, opts.limit);
      return rows.map(toPublic);
    },
    async getVerifiedByHandle(handle) {
      const c = db().creators.find((x) => x.status === "verified" && x.handle === handle.toLowerCase());
      return c ? toPublic(c) : null;
    },
    async getCreator(id) {
      const c = db().creators.find((x) => x.id === id);
      return c ? toCreator(c) : null;
    },
    async getAuthByHandle(handle): Promise<AuthRow | null> {
      const c = db().creators.find((x) => x.handle === handle.toLowerCase());
      return c
        ? { id: c.id, handle: c.handle, password_hash: c.password_hash, failed_logins: c.failed_logins, locked_until: c.locked_until }
        : null;
    },
    async createCreator(input) {
      const d = db();
      if (d.creators.some((c) => c.handle === input.handle.toLowerCase())) return { ok: false, reason: "handle_taken" };
      const row: CreatorRow = {
        id: uid(),
        handle: input.handle.toLowerCase(),
        instagram_url: input.instagram_url,
        display_name: input.display_name,
        city: "Rajkot",
        niche: null,
        languages: [],
        audience: null,
        video_types: [],
        best_reel_url: null,
        ambition: null,
        deal_types: [],
        price_reel: null,
        followers: null,
        created_at: new Date().toISOString(),
        verify_code: input.verify_code,
        status: "pending",
        verified_at: null,
        password_hash: input.password_hash,
        failed_logins: 0,
        locked_until: null,
      };
      d.creators.push(row);
      return { ok: true, id: row.id };
    },
    async registerLoginFailure(id) {
      const c = db().creators.find((x) => x.id === id);
      if (!c) return;
      c.failed_logins += 1;
      if (c.failed_logins >= 8) {
        c.locked_until = new Date(Date.now() + 15 * 60_000).toISOString();
        c.failed_logins = 0;
      }
    },
    async clearLoginFailures(id) {
      const c = db().creators.find((x) => x.id === id);
      if (c) {
        c.failed_logins = 0;
        c.locked_until = null;
      }
    },
    async updateProfile(id, input) {
      const c = db().creators.find((x) => x.id === id);
      if (c) Object.assign(c, input);
    },
    async createEnquiry(e) {
      db().enquiries.push({
        id: uid(),
        creator_id: e.creator_id,
        contact_name: e.contact_name,
        brand_name: e.brand_name,
        phone: e.phone,
        email: e.email,
        business_type: e.business_type,
        budget_band: e.budget_band,
        message: e.message,
        status: "new",
        agreed_price: null,
        created_at: new Date().toISOString(),
        status_changed_at: null,
        ip_hash: e.ip_hash,
      });
    },
    async countRecentEnquiriesByIp(ipHash, sinceIso) {
      return db().enquiries.filter((e) => e.ip_hash === ipHash && e.created_at >= sinceIso).length;
    },
    async listEnquiries(creatorId) {
      return db()
        .enquiries.filter((e) => e.creator_id === creatorId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map(toEnquiry);
    },
    async countNewEnquiries(creatorId) {
      return db().enquiries.filter((e) => e.creator_id === creatorId && e.status === "new").length;
    },
    async updateEnquiry(creatorId, enquiryId, status, agreedPrice) {
      const e = db().enquiries.find((x) => x.id === enquiryId && x.creator_id === creatorId);
      if (e) {
        e.status = status;
        e.agreed_price = agreedPrice;
        e.status_changed_at = new Date().toISOString();
      }
    },
    async adminListCreators() {
      return [...db().creators].sort((a, b) => b.created_at.localeCompare(a.created_at)).map(toCreator);
    },
    async adminSetStatus(id, status, followers) {
      const c = db().creators.find((x) => x.id === id);
      if (!c) return;
      c.status = status;
      c.verified_at = status === "verified" ? new Date().toISOString() : null;
      if (followers != null) c.followers = followers;
    },
    async adminSetFollowers(id, followers) {
      const c = db().creators.find((x) => x.id === id);
      if (c) c.followers = followers;
    },
    async adminDeleteCreator(id) {
      const d = db();
      d.creators = d.creators.filter((c) => c.id !== id);
      d.enquiries = d.enquiries.filter((e) => e.creator_id !== id);
    },
    async adminListEnquiries(limit) {
      const d = db();
      return [...d.enquiries]
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, limit)
        .map((e) => {
          const c = d.creators.find((x) => x.id === e.creator_id);
          return { ...toEnquiry(e), creator_name: c?.display_name ?? "?", creator_handle: c?.handle ?? "?" };
        });
    },
  };
}
