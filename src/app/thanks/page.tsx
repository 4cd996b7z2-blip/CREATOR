import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getI18n } from "@/lib/i18n-server";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Enquiry sent" };

export default async function Thanks({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const { t } = await getI18n();
  const creator = c ? await getStore().getVerifiedByHandle(c) : null;
  const name = creator?.display_name ?? "";

  return (
    <main className="mx-auto max-w-xl px-4 py-14 text-center">
      <CheckCircle2 size={72} className="mx-auto text-leaf" aria-hidden />
      <h1 className="mt-5 text-3xl font-extrabold">{t("thanks_title")}</h1>
      {name ? <p className="mt-3 text-lg">{t("thanks_body", { name })}</p> : null}
      <Link href="/creators" className="btn btn-primary mt-8">
        {t("thanks_more")}
      </Link>
    </main>
  );
}
