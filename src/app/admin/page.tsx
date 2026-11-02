import type { Metadata } from "next";
import { SubmitButton } from "@/components/forms";
import { I18nProvider } from "@/lib/i18n-client";
import { dicts } from "@/lib/dict";
import { adminEnabled, isAdmin } from "@/lib/session";
import { getStore } from "@/lib/store";
import type { Creator } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { adminDelete, adminLogin, adminLogout, adminSetFollowers, adminSetStatus } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const msAgo = (ms: number) => Date.now() - ms;

function LoginScreen({ error }: { error?: string }) {
  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-extrabold">Admin</h1>
      {!adminEnabled() ? (
        <p className="form-error mt-4">
          ADMIN_PASSWORD is not set (or shorter than 6 characters). Add it under Environment variables in your
          hosting dashboard (Netlify or Vercel), then redeploy.
        </p>
      ) : (
        <form action={adminLogin} className="card mt-4 space-y-4 p-5">
          {error === "wrong" && <p className="form-error">Wrong password.</p>}
          {error === "locked" && <p className="form-error">Too many attempts. Try again in 10 minutes.</p>}
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input id="password" name="password" type="password" className="field" autoComplete="current-password" />
          </div>
          <button className="btn btn-dark w-full">Log in</button>
        </form>
      )}
    </main>
  );
}

function CreatorRow({ c, kind }: { c: Creator; kind: "pending" | "verified" | "rejected" }) {
  const profileFilled = Boolean(c.niche && c.audience && c.video_types.length);
  return (
    <li className="card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-lg font-extrabold leading-tight">{c.display_name}</p>
          <a
            href={c.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-muted underline"
          >
            @{c.handle}
          </a>
          <p className="text-sm text-muted">
            {timeAgo(c.created_at, "en")} · profile {profileFilled ? "filled" : "empty"}
            {c.price_reel != null ? ` · ₹${c.price_reel}/reel` : ""}
          </p>
        </div>
        {kind !== "verified" && (
          <p className="rounded-lg bg-ink px-3 py-1.5 font-mono text-lg font-bold tracking-widest text-marigold">
            {c.verify_code}
          </p>
        )}
      </div>

      <form action={kind === "verified" ? adminSetFollowers : adminSetStatus} className="mt-3 flex flex-wrap items-end gap-2">
        <input type="hidden" name="id" value={c.id} />
        <div className="w-40">
          <label htmlFor={`f-${c.id}`} className="text-sm font-bold">
            Followers
          </label>
          <input
            id={`f-${c.id}`}
            name="followers"
            inputMode="numeric"
            className="field"
            style={{ minHeight: "2.75rem" }}
            defaultValue={c.followers ?? ""}
            placeholder="e.g. 25000"
          />
        </div>
        {kind === "verified" ? (
          <>
            <SubmitButton className="btn btn-outline btn-sm">Save followers</SubmitButton>
          </>
        ) : null}
        {kind === "pending" && (
          <>
            <SubmitButton name="status" value="verified" className="btn btn-primary btn-sm">
              Approve
            </SubmitButton>
            <SubmitButton name="status" value="rejected" className="btn btn-outline btn-sm">
              Reject
            </SubmitButton>
          </>
        )}
        {kind === "rejected" && (
          <SubmitButton name="status" value="pending" className="btn btn-outline btn-sm">
            Re-open
          </SubmitButton>
        )}
      </form>

      {kind === "verified" && (
        <form action={adminSetStatus} className="mt-2">
          <input type="hidden" name="id" value={c.id} />
          <SubmitButton name="status" value="pending" className="btn btn-outline btn-sm">
            Hide from site
          </SubmitButton>
        </form>
      )}

      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-bold text-rani">Delete…</summary>
        <form action={adminDelete} className="mt-2">
          <input type="hidden" name="id" value={c.id} />
          <p className="mb-2 text-sm">Removes this creator and all their enquiries. Cannot be undone.</p>
          <SubmitButton className="btn btn-sm bg-rani text-white">Yes, delete permanently</SubmitButton>
        </form>
      </details>
    </li>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (!(await isAdmin())) return <LoginScreen error={error} />;

  const store = getStore();
  const [creators, enquiries] = await Promise.all([store.adminListCreators(), store.adminListEnquiries(500)]);

  const pending = creators.filter((c) => c.status === "pending");
  const verified = creators.filter((c) => c.status === "verified");
  const rejected = creators.filter((c) => c.status === "rejected");
  const weekAgo = msAgo(7 * 86400_000);
  const enq7 = enquiries.filter((e) => new Date(e.created_at).getTime() >= weekAgo).length;
  const booked = enquiries.filter((e) => e.status === "booked").length;
  const contacted = enquiries.filter((e) => e.status === "contacted" || e.status === "booked").length;

  const stats = [
    ["Creators signed up", creators.length],
    ["Verified (live)", verified.length],
    ["Waiting for you", pending.length],
    ["Enquiries total", enquiries.length],
    ["Enquiries, last 7 days", enq7],
    ["Contacted or booked", contacted],
    ["Booked", booked],
  ] as const;

  return (
    <I18nProvider lang="en" dict={dicts.en}>
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold">Admin</h1>
          <form action={adminLogout}>
            <button className="btn btn-outline btn-sm">Log out</button>
          </form>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(([label, n]) => (
            <div key={label} className="card p-4">
              <dd className="text-3xl font-extrabold leading-none">{n}</dd>
              <dt className="mt-1 text-sm font-semibold text-muted">{label}</dt>
            </div>
          ))}
        </dl>

        <section>
          <h2 className="mb-1 text-xl font-extrabold">Waiting for verification ({pending.length})</h2>
          <p className="mb-3 text-muted">
            Check the Instagram DM came from the same @username and contains the code, then set their follower count
            from their profile and press Approve.
          </p>
          {pending.length ? (
            <ul className="space-y-3">
              {pending.map((c) => (
                <CreatorRow key={c.id} c={c} kind="pending" />
              ))}
            </ul>
          ) : (
            <p className="card p-4 text-muted">Nobody is waiting.</p>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-xl font-extrabold">Verified ({verified.length})</h2>
          {verified.length ? (
            <ul className="space-y-3">
              {verified.map((c) => (
                <CreatorRow key={c.id} c={c} kind="verified" />
              ))}
            </ul>
          ) : (
            <p className="card p-4 text-muted">No verified creators yet.</p>
          )}
        </section>

        {rejected.length > 0 && (
          <section>
            <h2 className="mb-3 text-xl font-extrabold">Rejected ({rejected.length})</h2>
            <ul className="space-y-3">
              {rejected.map((c) => (
                <CreatorRow key={c.id} c={c} kind="rejected" />
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-xl font-extrabold">Recent enquiries</h2>
          {enquiries.length ? (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-[0.95rem]">
                <thead className="border-b border-line text-muted">
                  <tr>
                    <th className="p-3">When</th>
                    <th className="p-3">Creator</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.slice(0, 100).map((e) => (
                    <tr key={e.id} className="border-b border-line last:border-0">
                      <td className="p-3 whitespace-nowrap">{timeAgo(e.created_at, "en")}</td>
                      <td className="p-3">@{e.creator_handle}</td>
                      <td className="p-3 font-semibold">{e.brand_name}</td>
                      <td className="p-3 whitespace-nowrap">
                        {e.contact_name} · {e.phone}
                      </td>
                      <td className="p-3">{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="card p-4 text-muted">No enquiries yet.</p>
          )}
        </section>
      </main>
    </I18nProvider>
  );
}
