"use client";

import { Home, LogIn, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n-client";

export function BottomNav({ loggedIn }: { loggedIn: boolean }) {
  const path = usePathname();
  const { t } = useI18n();
  if (path.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: t("nav_home"), icon: Home, active: path === "/" },
    { href: "/creators", label: t("nav_creators"), icon: Users, active: path.startsWith("/creators") || path.startsWith("/inquire") },
    loggedIn
      ? { href: "/dashboard", label: t("nav_dashboard"), icon: UserRound, active: path.startsWith("/dashboard") }
      : { href: "/register", label: t("nav_join"), icon: LogIn, active: path === "/register" || path === "/login" },
  ];

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-3">
        {items.map(({ href, label, icon: Icon, active }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-[0.8rem] font-bold ${
                active ? "text-ink" : "text-muted"
              }`}
            >
              <span className={`flex h-8 w-14 items-center justify-center rounded-full ${active ? "bg-marigold" : ""}`}>
                <Icon size={22} strokeWidth={active ? 2.6 : 2} aria-hidden />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
