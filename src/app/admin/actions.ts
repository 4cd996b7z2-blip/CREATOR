"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getClientIp } from "@/lib/request";
import {
  adminEnabled,
  checkAdminPassword,
  endAdminSession,
  isAdmin,
  startAdminSession,
} from "@/lib/session";
import { getStore } from "@/lib/store";
import type { CreatorStatus } from "@/lib/types";
import { str } from "@/lib/utils";

// Best-effort brute-force guard (per server instance). The real protection is a long ADMIN_PASSWORD.
const attempts = new Map<string, { n: number; until: number }>();

export async function adminLogin(fd: FormData) {
  if (!adminEnabled()) redirect("/admin");
  const ip = await getClientIp();
  const rec = attempts.get(ip);
  if (rec && rec.until > Date.now()) redirect("/admin?error=locked");

  if (checkAdminPassword(String(fd.get("password") ?? ""))) {
    attempts.delete(ip);
    await startAdminSession();
    redirect("/admin");
  }
  const n = (rec?.n ?? 0) + 1;
  attempts.set(ip, { n, until: n >= 5 ? Date.now() + 10 * 60_000 : 0 });
  redirect("/admin?error=wrong");
}

export async function adminLogout() {
  await endAdminSession();
  redirect("/admin");
}

async function guard() {
  if (!(await isAdmin())) redirect("/admin");
}

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/creators", "layout");
  revalidatePath("/");
}

function parseFollowers(raw: string): number | null {
  const n = Number(raw.replace(/[,\s]/g, ""));
  return raw && Number.isInteger(n) && n >= 0 && n <= 1_000_000_000 ? n : null;
}

const STATUSES: CreatorStatus[] = ["pending", "verified", "rejected"];

export async function adminSetStatus(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  const status = str(fd, "status") as CreatorStatus;
  if (!id || !STATUSES.includes(status)) return;
  await getStore().adminSetStatus(id, status, parseFollowers(str(fd, "followers")));
  refresh();
}

export async function adminSetFollowers(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  if (!id) return;
  await getStore().adminSetFollowers(id, parseFollowers(str(fd, "followers")));
  refresh();
}

export async function adminDelete(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  if (!id) return;
  await getStore().adminDeleteCreator(id);
  refresh();
}
