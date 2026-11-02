import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { getI18n } from "@/lib/i18n-server";
import { LogoMark } from "./icons";
import { LangToggle } from "./LangToggle";

export async function Header({ loggedIn }: { loggedIn: boolean }) {
  const { t } = await getI18n();
  const link = "rounded-lg px-3 py-2 font-semibold text-white/90 hover:bg-white/10";
  return (
    <header className="sticky top-0 z-30 bg-ink text-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <LogoMark size={32} />
          <span className="leading-none">{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <Link href="/creators" className={link}>
            {t("nav_creators")}
          </Link>
          {loggedIn ? (
            <Link href="/dashboard" className={link}>
              {t("nav_dashboard")}
            </Link>
          ) : (
            <Link href="/login" className={link}>
              {t("nav_login")}
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <LangToggle />
          {!loggedIn && (
            <Link href="/register" className="btn btn-primary btn-sm hidden md:inline-flex">
              {t("nav_join")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
