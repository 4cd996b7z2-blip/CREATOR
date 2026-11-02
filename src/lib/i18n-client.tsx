"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { translate, type Dict, type DictKey, type Lang } from "./dict";

type Ctx = { lang: Lang; dict: Dict };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ lang, dict, children }: { lang: Lang; dict: Dict; children: ReactNode }) {
  const value = useMemo(() => ({ lang, dict }), [lang, dict]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  const { lang, dict } = ctx;
  const t = useCallback(
    (key: DictKey, vars?: Record<string, string | number>) => translate(dict, key, vars),
    [dict],
  );
  return { lang, t };
}
