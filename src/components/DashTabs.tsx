"use client";

import { Inbox, LayoutDashboard, UserPen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n-client";

export function DashTabs({ newCount }: { newCount: number }) {
  const path = usePathname();
  const { t } = useI18n();
  const tabs = [
    { href: "/dashboard", label: t("dash_tab_home"), icon: LayoutDashboard },
    { href: "/dashboard/profile", label: t("dash_tab_profile"), icon: UserPen },
    { href: "/dashboard/enquiries", label: t("dash_tab_enq"), icon: Inbox, badge: newCount },
  ];
  return (
    <nav aria-label="Dashboard" className="flex gap-2">
      {tabs.map(({ href, label, icon: Icon, badge }) => {
        const active = path === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 px-2 text-center text-[0.95rem] font-bold leading-tight sm:px-4 sm:text-base ${
              active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
            }`}
          >
            <Icon size={20} aria-hidden className="hidden sm:block" />
            {label}
            {badge ? (
              <span className="chip chip-new min-w-6 justify-center px-1.5 py-0 text-sm" aria-label={`${badge}`}>
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
