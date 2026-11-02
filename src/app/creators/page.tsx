import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CreatorCard } from "@/components/CreatorCard";
import { NICHES, optLabel } from "@/lib/constants";
import { getI18n } from "@/lib/i18n-server";
import { getStore } from "@/lib/store";
import type { ListOpts } from "@/lib/types";

export const metadata: Metadata = { title: "Creators" };

type SP = { niche?: string; q?: string; sort?: string };

export default async function CreatorsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { t, lang } = await getI18n();
  const sort: NonNullable<ListOpts["sort"]> = sp.sort === "price" || sp.sort === "new" ? sp.sort : "followers";
  const q = (sp.q ?? "").trim().slice(0, 40);

  const all = await getStore().listVerified({ q, sort, limit: 200 });
  const present = NICHES.filter((n) => all.some((c) => c.niche === n.id));
  const niche = present.some((n) => n.id === sp.niche) ? sp.niche : undefined;
  const shown = niche ? all.filter((c) => c.niche === niche) : all;

  const href = (over: Partial<SP>) => {
    const p = new URLSearchParams();
    const next = { niche, q, sort: sort === "followers" ? undefined : sort, ...over };
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/creators?${s}` : "/creators";
  };

  const chipBase = "inline-flex min-h-11 shrink-0 items-center rounded-full border-2 px-4 font-bold";
  const chipOn = "border-ink bg-ink text-white";
  const chipOff = "border-line bg-white hover:border-ink";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-extrabold md:text-4xl">{t("catalog_title")}</h1>
      <p className="mt-1 text-lg text-muted">{t("catalog_sub")}</p>

      <form action="/creators" className="mt-6 flex gap-2" role="search">
        {niche ? <input type="hidden" name="niche" value={niche} /> : null}
        {sort !== "followers" ? <input type="hidden" name="sort" value={sort} /> : null}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={t("search_ph")}
          aria-label={t("search_ph")}
          className="field"
        />
        <button className="btn btn-dark shrink-0 px-4 sm:px-6" aria-label={t("search_btn")}>
          <Search size={22} aria-hidden />
          <span className="hidden sm:inline">{t("search_btn")}</span>
        </button>
      </form>

      {present.length > 0 && (
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2">
          <Link href={href({ niche: undefined })} className={`${chipBase} ${!niche ? chipOn : chipOff}`}>
            {t("filter_all")}
          </Link>
          {present.map((n) => (
            <Link key={n.id} href={href({ niche: n.id })} className={`${chipBase} ${niche === n.id ? chipOn : chipOff}`}>
              {optLabel(NICHES, n.id, lang)}
            </Link>
          ))}
        </div>
      )}

      {all.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.95rem]">
          <span className="font-bold text-muted">{t("sort_label")}:</span>
          {(
            [
              ["followers", t("sort_followers")],
              ["price", t("sort_price")],
              ["new", t("sort_new")],
            ] as const
          ).map(([id, label]) => (
            <Link
              key={id}
              href={href({ sort: id === "followers" ? undefined : id })}
              className={`inline-flex min-h-10 items-center rounded-full px-3.5 font-bold ${
                sort === id ? "bg-marigold" : "bg-white ring-1 ring-line hover:ring-ink"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {shown.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <CreatorCard key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <div className="card mt-8 flex flex-col items-start gap-4 p-6">
          <p className="text-lg font-semibold">{q || niche ? t("no_match") : t("no_creators")}</p>
          {q || niche ? (
            <Link href="/creators" className="btn btn-outline btn-sm">
              {t("clear_filters")}
            </Link>
          ) : null}
        </div>
      )}
    </main>
  );
}
