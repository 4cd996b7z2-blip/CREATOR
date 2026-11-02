import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getI18n } from "@/lib/i18n-server";
import { getCreatorId } from "@/lib/session";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Join as a creator" };

export default async function RegisterPage() {
  if (await getCreatorId()) redirect("/dashboard");
  const { t } = await getI18n();
  return (
    <main className="mx-auto max-w-xl px-4 py-8 md:py-12">
      <h1 className="text-3xl font-extrabold">{t("reg_title")}</h1>
      <p className="mt-2 text-lg text-muted">{t("reg_sub")}</p>
      <div className="card mt-6 p-5 md:p-7">
        <RegisterForm />
      </div>
      <p className="mt-5 text-center font-semibold">
        {t("reg_have_account")}{" "}
        <Link href="/login" className="underline">
          {t("nav_login")}
        </Link>
      </p>
    </main>
  );
}
