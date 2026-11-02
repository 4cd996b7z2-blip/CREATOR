import { createHash, randomInt } from "node:crypto";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatInr(n: number) {
  return "₹" + new Intl.NumberFormat("en-IN").format(n);
}

export function formatFollowers(n: number | null | undefined) {
  if (n == null) return "";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 100_000 ? 0 : 1).replace(/\.0$/, "") + "K";
  return String(n);
}

/** Accepts "@name", "name" or a full instagram.com URL. Returns a clean lowercase handle or null. */
export function normalizeHandle(input: string): string | null {
  let s = input.trim();
  s = s.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  s = s.replace(/^@/, "");
  s = s.split(/[/?#]/)[0] ?? "";
  s = s.toLowerCase();
  return /^[a-z0-9._]{1,30}$/.test(s) ? s : null;
}

/** Returns a 10 digit Indian mobile number or null. */
export function normalizePhone(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export function isHttpUrl(s: string) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function genVerifyCode() {
  let s = "";
  for (let i = 0; i < 5; i++) s += CODE_CHARS[randomInt(CODE_CHARS.length)];
  return "RC-" + s;
}

export function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT || process.env.ADMIN_PASSWORD || "rajkot-creators";
  return createHash("sha256").update(ip + salt).digest("hex").slice(0, 32);
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = Array.from(parts[0] ?? "?")[0] ?? "?";
  const second = parts.length > 1 ? (Array.from(parts[1])[0] ?? "") : "";
  return (first + second).toUpperCase();
}

export function timeAgo(iso: string, lang: "en" | "gu") {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (lang === "gu") {
    if (m < 1) return "હમણાં જ";
    if (m < 60) return `${m} મિનિટ પહેલાં`;
    if (h < 24) return `${h} કલાક પહેલાં`;
    return `${d} દિવસ પહેલાં`;
  }
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  if (h < 24) return `${h} hr ago`;
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

export function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
