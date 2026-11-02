"use server";

import { revalidatePath } from "next/cache";
import { CITIES, DEAL_TYPES, LANGUAGES, NICHES, VIDEO_TYPES } from "@/lib/constants";
import { requireCreator } from "@/lib/session";
import { getStore } from "@/lib/store";
import type { EnquiryStatus, FormState } from "@/lib/types";
import { isHttpUrl, str } from "@/lib/utils";

const pick = (fd: FormData, key: string, allowed: { id: string }[]) =>
  fd
    .getAll(key)
    .filter((v): v is string => typeof v === "string" && allowed.some((a) => a.id === v));

export async function saveProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireCreator();

  const values = {
    display_name: str(fd, "display_name"),
    city: str(fd, "city"),
    niche: str(fd, "niche"),
    audience: str(fd, "audience"),
    best_reel_url: str(fd, "best_reel_url"),
    ambition: str(fd, "ambition"),
    price_reel: str(fd, "price_reel").replace(/[,\s₹]/g, ""),
  };
  const languages = pick(fd, "languages", LANGUAGES);
  const video_types = pick(fd, "video_types", VIDEO_TYPES);
  const deal_types = pick(fd, "deal_types", DEAL_TYPES);

  const fieldErrors: Record<string, string> = {};
  if (values.display_name.length < 2) fieldErrors.display_name = "err_required";
  if (values.best_reel_url && !isHttpUrl(values.best_reel_url)) fieldErrors.best_reel_url = "err_url";
  let price: number | null = null;
  if (values.price_reel) {
    const n = Number(values.price_reel);
    if (!Number.isInteger(n) || n < 0 || n > 10_000_000) fieldErrors.price_reel = "err_price";
    else price = n;
  }
  const echo = { ...values, languages, video_types, deal_types };
  if (Object.keys(fieldErrors).length) return { fieldErrors, values: echo };

  await getStore().updateProfile(me.id, {
    display_name: values.display_name.slice(0, 60),
    city: CITIES.includes(values.city) ? values.city : "Rajkot",
    niche: NICHES.some((n) => n.id === values.niche) ? values.niche : null,
    languages,
    audience: values.audience ? values.audience.slice(0, 400) : null,
    video_types,
    best_reel_url: values.best_reel_url || null,
    ambition: values.ambition ? values.ambition.slice(0, 300) : null,
    deal_types,
    price_reel: price,
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath("/creators", "layout");
  return { ok: true, values: echo };
}

const STATUSES: EnquiryStatus[] = ["new", "contacted", "booked", "declined"];

export async function updateEnquiryStatus(fd: FormData) {
  const me = await requireCreator();
  const id = str(fd, "id");
  const status = str(fd, "status") as EnquiryStatus;
  if (!id || !STATUSES.includes(status)) return;
  const raw = str(fd, "agreed_price").replace(/[,\s₹]/g, "");
  const n = raw ? Number(raw) : NaN;
  const agreed = status === "booked" && Number.isInteger(n) && n >= 0 && n <= 10_000_000 ? n : null;
  await getStore().updateEnquiry(me.id, id, status, agreed);
  revalidatePath("/dashboard", "layout");
}
