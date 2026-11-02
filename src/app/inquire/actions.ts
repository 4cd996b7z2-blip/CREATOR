"use server";

import { redirect } from "next/navigation";
import { BUDGETS, BUSINESS_TYPES } from "@/lib/constants";
import { getClientIp } from "@/lib/request";
import { getStore } from "@/lib/store";
import type { FormState } from "@/lib/types";
import { hashIp, isEmail, normalizePhone, str } from "@/lib/utils";

const MAX_PER_HOUR = 5;

export async function submitEnquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const handle = str(fd, "handle").toLowerCase();
  const values: Record<string, string> = {
    contact_name: str(fd, "contact_name"),
    brand_name: str(fd, "brand_name"),
    phone: str(fd, "phone"),
    email: str(fd, "email"),
    business_type: str(fd, "business_type"),
    budget_band: str(fd, "budget_band"),
    message: str(fd, "message"),
  };

  const store = getStore();
  const creator = await store.getVerifiedByHandle(handle);
  if (!creator) return { error: "err_generic", values };

  // Bots fill the hidden field: pretend it worked and drop the message.
  if (str(fd, "website")) redirect(`/thanks?c=${creator.handle}`);

  // Humans need a couple of seconds to fill the form; scripts do not.
  const started = Number(str(fd, "t"));
  const elapsed = Date.now() - started;
  if (!Number.isFinite(started) || elapsed < 2000 || elapsed > 24 * 3600_000) {
    return { error: "err_generic", values };
  }

  const fieldErrors: Record<string, string> = {};
  if (values.contact_name.length < 2) fieldErrors.contact_name = "err_required";
  if (values.brand_name.length < 2) fieldErrors.brand_name = "err_required";
  const phone = normalizePhone(values.phone);
  if (!phone) fieldErrors.phone = "err_phone";
  if (values.message.length < 3) fieldErrors.message = "err_required";
  if (values.email && !isEmail(values.email)) fieldErrors.email = "err_required";
  if (fd.get("consent") !== "on") fieldErrors.consent = "err_consent";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const ipHash = hashIp(await getClientIp());
  const recent = await store.countRecentEnquiriesByIp(ipHash, new Date(Date.now() - 3600_000).toISOString());
  if (recent >= MAX_PER_HOUR) return { error: "err_rate", values };

  await store.createEnquiry({
    creator_id: creator.id,
    contact_name: values.contact_name.slice(0, 80),
    brand_name: values.brand_name.slice(0, 100),
    phone: phone!,
    email: values.email ? values.email.slice(0, 120) : null,
    business_type: BUSINESS_TYPES.some((b) => b.id === values.business_type) ? values.business_type : null,
    budget_band: BUDGETS.some((b) => b.id === values.budget_band) ? values.budget_band : null,
    message: values.message.slice(0, 1000),
    ip_hash: ipHash,
  });

  redirect(`/thanks?c=${creator.handle}`);
}
