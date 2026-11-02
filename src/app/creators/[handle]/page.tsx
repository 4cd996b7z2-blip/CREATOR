import { ArrowLeft, BadgeCheck, ExternalLink, MapPin, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { InstagramIcon } from "@/components/icons";
import { DEAL_TYPES, LANGUAGES, NICHES, VIDEO_TYPES, optLabel, optLabels } from "@/lib/constants";
import { getI18n } from "@/lib/i18n-server";
import { getStore } from "@/lib/store";
import { formatFollowers, formatInr } from "@/lib/utils";

type Props = { params: Promise<{ handle: string }> };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-extrabold">{title}</h2>
      {children}
    </section>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const c = await getStore().getVerifiedByHandle(decodeURIComponent(handle));
  return { title: c ? `${c.display_name} (@${c.handle})` : "Creator" };
}

export default async function CreatorProfile({ params }: Props) {
  const { handle } = await params;
  const c = await getStore().getVerifiedByHandle(decodeURIComponent(handle));
  if (!c) notFound();
  const { t, lang } = await getI18n();

  const inquire = (
    <Link href={`/inquire/${c.handle}`} className="btn btn-primary w-full sm:w-auto">
      {t("send_enquiry")}
    </Link>
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <Link href="/creators" className="inline-flex min-h-11 items-center gap-1.5 font-bold text-muted hover:text-ink">
        <ArrowLeft size={20} aria-hidden />
        {t("back_creators")}
      </Link>

      <div className="card mt-3 p-5 md:p-7">
        <div className="flex items-center gap-4">
          <Avatar name={c.display_name} seed={c.handle} size="lg" />
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-2xl font-extrabold leading-tight md:text-3xl">
              <span className="break-words">{c.display_name}</span>
              <BadgeCheck size={26} className="shrink-0 text-leaf" aria-label={t("verified")} />
            </h1>
            <a
              href={c.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-10 items-center gap-1.5 font-bold text-muted hover:text-ink"
            >
              <InstagramIcon size={18} />@{c.handle}
            </a>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {c.niche ? <span className="chip">{optLabel(NICHES, c.niche, lang)}</span> : null}
          <span className="chip">
            <MapPin size={14} aria-hidden />
            {c.city}
          </span>
          {optLabels(LANGUAGES, c.languages, lang).map((l) => (
            <span key={l} className="chip">
              {l}
            </span>
          ))}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-paper p-4">
            <dt className="text-[0.95rem] font-semibold text-muted">{t("followers")}</dt>
            <dd className="text-2xl font-extrabold">{c.followers != null ? formatFollowers(c.followers) : "–"}</dd>
          </div>
          <div className="rounded-2xl bg-marigold/25 p-4 ring-2 ring-marigold">
            <dt className="text-[0.95rem] font-semibold text-muted">{t("profile_price")}</dt>
            <dd className="text-2xl font-extrabold">
              {c.price_reel != null ? formatInr(c.price_reel) : <span className="text-lg">{t("price_on_request")}</span>}
            </dd>
          </div>
        </dl>

        <div className="mt-5">{inquire}</div>
      </div>

      <div className="card mt-4 space-y-6 p-5 md:p-7">
        {c.audience ? (
          <Section title={t("profile_audience")}>
            <p className="whitespace-pre-line">{c.audience}</p>
          </Section>
        ) : null}
        {c.video_types.length > 0 ? (
          <Section title={t("profile_content")}>
            <div className="flex flex-wrap gap-1.5">
              {optLabels(VIDEO_TYPES, c.video_types, lang).map((v) => (
                <span key={v} className="chip">
                  {v}
                </span>
              ))}
            </div>
          </Section>
        ) : null}
        {c.deal_types.length > 0 ? (
          <Section title={t("profile_deals")}>
            <div className="flex flex-wrap gap-1.5">
              {optLabels(DEAL_TYPES, c.deal_types, lang).map((v) => (
                <span key={v} className="chip chip-leaf">
                  {v}
                </span>
              ))}
            </div>
          </Section>
        ) : null}
        {c.ambition ? (
          <Section title={t("profile_ambition")}>
            <p className="whitespace-pre-line">{c.ambition}</p>
          </Section>
        ) : null}
        {c.best_reel_url ? (
          <Section title={t("profile_best_reel")}>
            <a href={c.best_reel_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <Play size={18} aria-hidden />
              {t("watch_reel")}
              <ExternalLink size={16} aria-hidden />
            </a>
          </Section>
        ) : null}
        <div className="border-t border-line pt-5">{inquire}</div>
      </div>
    </main>
  );
}
