import { BadgeCheck, IndianRupee, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CreatorCard } from "@/components/CreatorCard";
import { getI18n } from "@/lib/i18n-server";
import { getStore } from "@/lib/store";

export default async function Home() {
  const { t } = await getI18n();
  const creators = await getStore().listVerified({ limit: 6, sort: "followers" });

  const steps = [
    { n: 1, title: t("how1_t"), body: t("how1_d") },
    { n: 2, title: t("how2_t"), body: t("how2_d") },
    { n: 3, title: t("how3_t"), body: t("how3_d") },
  ];
  const trust = [
    { icon: ShieldCheck, text: t("trust1") },
    { icon: IndianRupee, text: t("trust2") },
    { icon: BadgeCheck, text: t("trust3") },
  ];

  return (
    <>
      <section className="bandhani text-white">
        <div className="mx-auto max-w-5xl px-4 pb-14 pt-10 md:pb-20 md:pt-16">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-marigold/60 px-3.5 py-1 text-[0.95rem] font-bold text-marigold">
              <ShieldCheck size={18} aria-hidden />
              {t("hero_chip")}
            </p>
            <h1 className="text-[2.1rem] font-extrabold leading-[1.3] sm:text-5xl sm:leading-[1.25]">{t("hero_title")}</h1>
            <p className="mt-5 max-w-lg text-lg text-white/85">{t("hero_sub")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/creators" className="btn btn-primary">
                {t("cta_browse")}
              </Link>
              <Link
                href="/register"
                className="btn border-white/70 text-white hover:bg-white/10"
              >
                {t("cta_creator")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-12">
        <h2 className="text-2xl font-extrabold md:text-3xl">{t("how_title")}</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="card flex gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-marigold text-xl font-extrabold">
                {s.n}
              </span>
              <div>
                <h3 className="text-lg font-extrabold">{s.title}</h3>
                <p className="mt-1 text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {trust.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 font-semibold">
              <Icon size={24} className="mt-0.5 shrink-0 text-leaf" aria-hidden />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-14">
        <h2 className="text-2xl font-extrabold md:text-3xl">{t("featured_title")}</h2>
        {creators.length > 0 ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {creators.map((c) => (
                <CreatorCard key={c.id} c={c} />
              ))}
            </div>
            <div className="mt-8">
              <Link href="/creators" className="btn btn-dark">
                {t("see_all")}
              </Link>
            </div>
          </>
        ) : (
          <p className="card mt-6 p-6 text-lg font-semibold text-muted">{t("featured_empty")}</p>
        )}
      </section>

      <section className="mx-auto mt-14 max-w-5xl px-4">
        <div className="rounded-[1.75rem] bg-marigold p-6 md:flex md:items-center md:justify-between md:gap-10 md:p-10">
          <div className="max-w-md">
            <h2 className="text-2xl font-extrabold md:text-3xl">{t("creator_band_title")}</h2>
            <p className="mt-2 text-lg">{t("creator_band_sub")}</p>
            <ul className="mt-4 space-y-1.5 font-bold">
              <li>✓ {t("creator_step1")}</li>
              <li>✓ {t("creator_step2")}</li>
              <li>✓ {t("creator_step3")}</li>
            </ul>
          </div>
          <Link href="/register" className="btn btn-dark mt-6 w-full md:mt-0 md:w-auto md:shrink-0">
            {t("nav_join")}
          </Link>
        </div>
      </section>
    </>
  );
}
