import Link from "next/link";
import { PLATFORM_IG, SITE_NAME } from "@/lib/constants";
import { getI18n } from "@/lib/i18n-server";
import { InstagramIcon } from "./icons";

export async function Footer() {
  const { t } = await getI18n();
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-[0.95rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-ink">
          {SITE_NAME} · {t("made_in")}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-semibold">
          <a
            href={`https://instagram.com/${PLATFORM_IG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1.5 text-ink hover:underline"
          >
            <InstagramIcon size={18} />@{PLATFORM_IG}
          </a>
          <Link href="/privacy" className="inline-flex min-h-10 items-center hover:underline">
            {t("nav_privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
