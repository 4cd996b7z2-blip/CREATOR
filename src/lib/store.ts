import { memoryStore } from "./store-memory";
import { supabaseStore } from "./store-supabase";
import type { Store } from "./store-types";

/** Local testing only. Never active on Vercel, even if the variable is set by mistake. */
export function isMock() {
  return process.env.USE_MOCK_DB === "1" && !process.env.VERCEL;
}

export function isConfigured() {
  if (isMock()) return true;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let cached: Store | null = null;
export function getStore(): Store {
  if (!cached) cached = isMock() ? memoryStore() : supabaseStore();
  return cached;
}
