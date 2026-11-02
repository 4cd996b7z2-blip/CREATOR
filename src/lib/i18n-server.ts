import { cookies } from "next/headers";
import { dicts, translate, type DictKey, type Lang } from "./dict";

export const LANG_COOKIE = "lang";

export function defaultLang(): Lang {
  return process.env.NEXT_PUBLIC_DEFAULT_LANG === "en" ? "en" : "gu";
}

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return v === "en" || v === "gu" ? v : defaultLang();
}

export async function getI18n() {
  const lang = await getLang();
  const dict = dicts[lang];
  const t = (key: DictKey, vars?: Record<string, string | number>) => translate(dict, key, vars);
  return { lang, dict, t };
}
