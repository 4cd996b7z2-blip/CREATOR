// Shown instead of the site when production env vars are missing. English only: this is for the site owner.
export function SetupIncomplete() {
  const need = [
    { name: "SUPABASE_URL", ok: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) },
    { name: "SUPABASE_SERVICE_ROLE_KEY", ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) },
    { name: "ADMIN_PASSWORD", ok: Boolean(process.env.ADMIN_PASSWORD) },
  ];
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-5 px-5 py-10">
      <h1 className="text-3xl font-extrabold">Setup is not finished</h1>
      <p>
        The site is deployed, but it cannot reach its database yet. Add these environment variables in your hosting
        dashboard (Netlify: Site configuration → Environment variables. Vercel: Settings → Environment Variables),
        then redeploy:
      </p>
      <ul className="card divide-y divide-line">
        {need.map((n) => (
          <li key={n.name} className="flex items-center justify-between gap-3 px-4 py-3 font-mono text-sm">
            <span>{n.name}</span>
            <span className={n.ok ? "font-bold text-leaf" : "font-bold text-rani"}>{n.ok ? "set" : "missing"}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">Full steps are in README.md in the repository.</p>
    </main>
  );
}
