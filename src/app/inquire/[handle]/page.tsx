import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { getI18n } from "@/lib/i18n-server";
import { getStore } from "@/lib/store";
import { formatInr } from "@/lib/utils";
import { EnquiryForm } from "./EnquiryForm";

type Props = { params: Promise<{ handle: string }> };

const issueTimestamp = () => String(Date.now());

export const metadata: Metadata = { title: "Send enquiry" };

export default async function InquirePage({ params }: Props) {
  const { handle } = await params;
  const c = await getStore().getVerifiedByHandle(decodeURIComponent(handle));
  if (!c) notFound();
  const { t } = await getI18n();

  return (
    <main className="mx-auto max-w-xl px-4 py-6 md:py-10">
      <Link
        href={`/creators/${c.handle}`}
        className="inline-flex min-h-11 items-center gap-1.5 font-bold text-muted hover:text-ink"
      >
        <ArrowLeft size={20} aria-hidden />
        {c.display_name}
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <Avatar name={c.display_name} seed={c.handle} />
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold leading-tight">
            {t("enq_title")} {c.display_name}
          </h1>
          {c.price_reel != null ? (
            <p className="font-semibold text-muted">
              {formatInr(c.price_reel)} {t("per_reel")}
            </p>
          ) : null}
        </div>
      </div>
      <p className="mt-3 text-lg text-muted">{t("enq_sub")}</p>

      <div className="card mt-5 p-5 md:p-7">
        <EnquiryForm handle={c.handle} issuedAt={issueTimestamp()} />
      </div>
    </main>
  );
}
