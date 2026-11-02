import Link from "next/link";
import { getI18n } from "@/lib/i18n-server";

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-7xl font-extrabold text-marigold">404</p>
      <h1 className="mt-4 text-2xl font-extrabold">{t("nf_title")}</h1>
      <p className="mt-2 text-muted">{t("nf_body")}</p>
      <Link href="/creators" className="btn btn-primary mt-8">
        {t("cta_browse")}
      </Link>
    </main>
  );
}
