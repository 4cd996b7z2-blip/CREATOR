import { LogOut } from "lucide-react";
import type { Metadata } from "next";
import { logoutCreator } from "@/app/auth/actions";
import { DashTabs } from "@/components/DashTabs";
import { getI18n } from "@/lib/i18n-server";
import { requireCreator } from "@/lib/session";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "My dashboard", robots: { index: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const me = await requireCreator();
  const { t } = await getI18n();
  const newCount = await getStore().countNewEnquiries(me.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted">{t("dash_hello")},</p>
          <p className="truncate text-2xl font-extrabold">{me.display_name}</p>
        </div>
        <form action={logoutCreator}>
          <button className="btn btn-outline btn-sm" aria-label={t("nav_logout")}>
            <LogOut size={18} aria-hidden />
            <span className="hidden sm:inline">{t("nav_logout")}</span>
          </button>
        </form>
      </div>
      <div className="mt-5">
        <DashTabs newCount={newCount} />
      </div>
      <div className="mt-5">{children}</div>
    </main>
  );
}
