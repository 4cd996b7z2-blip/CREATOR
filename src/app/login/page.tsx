import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PLATFORM_IG } from "@/lib/constants";
import { getI18n } from "@/lib/i18n-server";
import { getCreatorId } from "@/lib/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Creator log in" };

export default async function LoginPage() {
  if (await getCreatorId()) redirect("/dashboard");
  const { t } = await getI18n();
  return (
    <main className="mx-auto max-w-xl px-4 py-8 md:py-12">
      <h1 className="text-3xl font-extrabold">{t("login_title")}</h1>
      <div className="card mt-6 p-5 md:p-7">
        <LoginForm />
      </div>
      <p className="mt-5 text-center font-semibold">
        {t("login_new")}{" "}
        <Link href="/register" className="underline">
          {t("nav_join")}
        </Link>
      </p>
      <p className="mt-3 text-center text-muted">
        {t("forgot_note")}{" "}
        <a
          href={`https://ig.me/m/${PLATFORM_IG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-ink underline"
        >
          @{PLATFORM_IG}
        </a>
      </p>
    </main>
  );
}
