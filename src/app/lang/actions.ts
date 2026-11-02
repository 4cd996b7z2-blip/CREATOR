"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { LANG_COOKIE } from "@/lib/i18n-server";

export async function setLang(formData: FormData) {
  const lang = formData.get("lang");
  if (lang === "en" || lang === "gu") {
    (await cookies()).set(LANG_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  revalidatePath("/", "layout");
}
