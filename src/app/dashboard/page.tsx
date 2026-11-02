import { CheckCircle2, Circle, Clock, ExternalLink, Inbox } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { PLATFORM_IG, SITE_NAME } from "@/lib/constants";
import { getI18n } from "@/lib/i18n-server";
import { getOrigin } from "@/lib/request";
import { requireCreator } from "@/lib/session";
import { getStore } from "@/lib/store";

export default async function DashboardHome() {
  const me = await requireCreator();
  const { t } = await getI18n();
  const enquiries = await getStore().listEnquiries(me.id);
  const newCount = enquiries.filter((e) => e.status === "new").length;
  const profileDone = Boolean(me.niche && me.audience && me.video_types.length > 0);

  let status: React.ReactNode;

  if (me.status === "verified") {
    const origin = await getOrigin();
    const url = `${origin}/creators/${me.handle}`;
    const shareText = t("share_text", { site: SITE_NAME, url });
    status = (
      <section className="card border-leaf p-5 ring-2 ring-leaf/30">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-leaf">
          <CheckCircle2 size={26} aria-hidden />
          {t("status_live_t")}
        </h2>
        <p className="mt-1">{t("status_live_d")}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link href={`/creators/${me.handle}`} className="btn btn-dark">
            {t("btn_view_public")}
          </Link>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa"
          >
            <WhatsAppIcon size={22} />
            {t("btn_share_wa")}
          </a>
        </div>
      </section>
    );
  } else if (me.status === "rejected") {
    status = (
      <section className="card border-rani p-5">
        <h2 className="text-xl font-extrabold text-rani">{t("status_rejected_t")}</h2>
        <p className="mt-1">{t("status_rejected_d")}</p>
        <a
          href={`https://ig.me/m/${PLATFORM_IG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-dark mt-4"
        >
          <InstagramIcon size={20} />@{PLATFORM_IG}
        </a>
      </section>
    );
  } else {
    status = (
      <section className="card p-5">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Clock size={24} className="text-marigold" aria-hidden />
          {t("status_pending_t")}
        </h2>
        <p className="mt-1 text-muted">{t("status_pending_d")}</p>

        <ol className="mt-5 space-y-6">
          <li className="flex gap-3">
            {profileDone ? (
              <CheckCircle2 size={26} className="mt-0.5 shrink-0 text-leaf" aria-hidden />
            ) : (
              <Circle size={26} className="mt-0.5 shrink-0 text-muted" aria-hidden />
            )}
            <div>
              <p className="font-bold">{profileDone ? t("step_profile_done") : t("step_profile")}</p>
              {!profileDone && (
                <Link href="/dashboard/profile" className="btn btn-primary btn-sm mt-2">
                  {t("btn_fill_profile")}
                </Link>
              )}
            </div>
          </li>

          <li className="flex gap-3">
            <Circle size={26} className="mt-0.5 shrink-0 text-muted" aria-hidden />
            <div className="min-w-0">
              <p className="font-bold">{t("step_dm", { handle: me.handle })}</p>
              <p className="mt-2 inline-block rounded-xl bg-ink px-5 py-2 font-mono text-2xl font-bold tracking-widest text-marigold">
                {me.verify_code}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <CopyButton text={me.verify_code} />
                <a
                  href={`https://ig.me/m/${PLATFORM_IG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark btn-sm"
                >
                  <InstagramIcon size={18} />
                  {t("btn_open_ig")}
                  <ExternalLink size={16} aria-hidden />
                </a>
              </div>
            </div>
          </li>

          <li className="flex gap-3">
            <Clock size={26} className="mt-0.5 shrink-0 text-muted" aria-hidden />
            <p className="font-bold">{t("step_wait")}</p>
          </li>
        </ol>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {status}
      <Link href="/dashboard/enquiries" className="card flex items-center justify-between gap-4 p-5 hover:border-ink">
        <div className="flex items-center gap-4">
          <Inbox size={32} aria-hidden />
          <div>
            <p className="text-3xl font-extrabold leading-none">{newCount}</p>
            <p className="font-semibold text-muted">{t("new_enq_count")}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold leading-none">{enquiries.length}</p>
          <p className="text-sm font-semibold text-muted">{t("all_enq_count")}</p>
        </div>
      </Link>
    </div>
  );
}
