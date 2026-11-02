import { headers } from "next/headers";

export async function getClientIp(): Promise<string> {
  const h = await headers();
  // Netlify puts the visitor's address in x-nf-client-connection-ip; Vercel and others use x-forwarded-for.
  const nf = h.get("x-nf-client-connection-ip");
  if (nf) return nf.trim();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") || "unknown";
}

/** Public origin of the site, e.g. https://rajkot-creators.vercel.app */
export async function getOrigin(): Promise<string> {
  const fixed = process.env.NEXT_PUBLIC_SITE_URL;
  if (fixed) return fixed.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
