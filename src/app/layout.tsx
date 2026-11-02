import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/noto-sans-gujarati";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SetupIncomplete } from "@/components/SetupIncomplete";
import { SITE_NAME } from "@/lib/constants";
import { I18nProvider } from "@/lib/i18n-client";
import { getI18n } from "@/lib/i18n-server";
import { getCreatorId } from "@/lib/session";
import { isConfigured } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getI18n();
  const tagline = lang === "gu" ? "રાજકોટના ઇન્સ્ટાગ્રામ ક્રિએટર" : "Instagram creators in Rajkot";
  const description =
    lang === "gu"
      ? "ચકાસેલા લોકલ ક્રિએટરના સાચા ભાવ જુઓ અને 1 મિનિટમાં પૂછપરછ મોકલો. બિઝનેસ માટે મફત."
      : "See real prices of checked local creators and send your enquiry in 1 minute. Free for businesses.";
  return {
    title: { default: `${SITE_NAME}: ${tagline}`, template: `%s | ${SITE_NAME}` },
    description,
    openGraph: { title: `${SITE_NAME}: ${tagline}`, description, type: "website", locale: lang === "gu" ? "gu_IN" : "en_IN" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b1f4b",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, dict } = await getI18n();

  if (!isConfigured()) {
    return (
      <html lang="en">
        <body>
          <SetupIncomplete />
        </body>
      </html>
    );
  }

  const loggedIn = Boolean(await getCreatorId());

  return (
    <html lang={lang}>
      <body className="flex min-h-screen flex-col pb-20 md:pb-0">
        <I18nProvider lang={lang} dict={dict}>
          <Header loggedIn={loggedIn} />
          <div className="flex-1">{children}</div>
          <Footer />
          <BottomNav loggedIn={loggedIn} />
        </I18nProvider>
      </body>
    </html>
  );
}
