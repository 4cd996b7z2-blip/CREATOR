"use client";

import { useI18n } from "@/lib/i18n-client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-extrabold">{t("err_title")}</h1>
      <p className="mt-2 text-muted">{t("err_body")}</p>
      <button onClick={reset} className="btn btn-primary mt-8">
        {t("retry")}
      </button>
    </main>
  );
}
