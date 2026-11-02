import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { NICHES, optLabel } from "@/lib/constants";
import { getI18n } from "@/lib/i18n-server";
import type { PublicCreator } from "@/lib/types";
import { formatFollowers, formatInr } from "@/lib/utils";
import { Avatar } from "./Avatar";

export async function CreatorCard({ c }: { c: PublicCreator }) {
  const { t, lang } = await getI18n();
  return (
    <article className="card flex flex-col gap-4 p-4">
      <Link href={`/creators/${c.handle}`} className="flex items-center gap-3">
        <Avatar name={c.display_name} seed={c.handle} />
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 text-lg font-extrabold leading-tight">
            <span className="truncate">{c.display_name}</span>
            <BadgeCheck size={20} className="shrink-0 text-leaf" aria-label={t("verified")} />
          </h3>
          <p className="truncate text-[0.95rem] text-muted">@{c.handle}</p>
        </div>
      </Link>

      <div className="flex flex-wrap gap-1.5">
        {c.niche ? <span className="chip">{optLabel(NICHES, c.niche, lang)}</span> : null}
        {c.followers != null ? (
          <span className="chip chip-gold">
            {formatFollowers(c.followers)} {t("followers")}
          </span>
        ) : null}
      </div>

      {c.price_reel != null ? (
        <p className="flex items-baseline gap-2">
          <span className="text-[1.75rem] font-extrabold leading-none">{formatInr(c.price_reel)}</span>
          <span className="text-sm font-semibold text-muted">{t("per_reel")}</span>
        </p>
      ) : (
        <p className="font-bold text-muted">{t("price_on_request")}</p>
      )}

      <div className="mt-auto grid grid-cols-2 gap-2">
        <Link href={`/creators/${c.handle}`} className="btn btn-outline btn-sm">
          {t("view_profile")}
        </Link>
        <Link href={`/inquire/${c.handle}`} className="btn btn-primary btn-sm">
          {t("send_enquiry")}
        </Link>
      </div>
    </article>
  );
}
