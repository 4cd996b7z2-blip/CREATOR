import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getStore } from "./store";
import type { Creator } from "./types";

const CREATOR_COOKIE = "rc_session";
const ADMIN_COOKIE = "rc_admin";
const CREATOR_DAYS = 30;
const ADMIN_HOURS = 12;

function key() {
  const base =
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.ADMIN_PASSWORD ||
    "local-testing-only";
  return createHash("sha256").update("rc-session:" + base).digest();
}

function sign(payload: Record<string, unknown>) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", key()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify<T extends { exp: number }>(token: string | undefined): T | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", key()).update(body).digest();
  let given: Buffer;
  try {
    given = Buffer.from(sig, "base64url");
  } catch {
    return null;
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

function cookieOpts(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: Boolean(process.env.VERCEL),
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

// ---- creators ----

export async function startCreatorSession(id: string) {
  const exp = Date.now() + CREATOR_DAYS * 86400_000;
  (await cookies()).set(CREATOR_COOKIE, sign({ sub: id, exp }), cookieOpts(CREATOR_DAYS * 86400));
}

export async function endCreatorSession() {
  (await cookies()).delete(CREATOR_COOKIE);
}

export async function getCreatorId(): Promise<string | null> {
  const token = (await cookies()).get(CREATOR_COOKIE)?.value;
  return verify<{ sub: string; exp: number }>(token)?.sub ?? null;
}

/** Use at the top of every creator page and server action. Layout checks alone are not enough in Next.js. */
const loadCreator = cache(async (id: string) => getStore().getCreator(id));

export async function requireCreator(): Promise<Creator> {
  const id = await getCreatorId();
  if (!id) redirect("/login");
  const creator = await loadCreator(id);
  if (!creator) redirect("/login");
  return creator;
}

// ---- admin ----

export function adminEnabled() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 6);
}

export function checkAdminPassword(input: string) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(real).digest();
  return timingSafeEqual(a, b);
}

export async function startAdminSession() {
  const exp = Date.now() + ADMIN_HOURS * 3600_000;
  (await cookies()).set(ADMIN_COOKIE, sign({ admin: true, exp }), cookieOpts(ADMIN_HOURS * 3600));
}

export async function endAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function isAdmin() {
  if (!adminEnabled()) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verify<{ admin: boolean; exp: number }>(token)?.admin === true;
}
