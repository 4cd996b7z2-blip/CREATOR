import type { Metadata } from "next";
import { PLATFORM_IG, SITE_NAME } from "@/lib/constants";
import { getI18n } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Privacy" };

const COPY = {
  en: {
    title: "Privacy Policy",
    sections: [
      [
        "What we collect",
        "Creators: Instagram username, name, a password (stored only as a one-way hash), and the profile details you choose to fill. Businesses: the name, brand, phone number, optional email and message you type into an enquiry form. We also keep a scrambled (hashed) version of your internet address for a short time to stop spam. We do not store it in readable form.",
      ],
      [
        "Who sees it",
        "A creator's public profile (name, username, prices, what they fill in) is visible to everyone once verified. A business's enquiry details are shown only to the creator it was sent to, and to the site team. We never sell your data and we do not show phone numbers publicly.",
      ],
      [
        "No commission, no payments",
        "We only connect businesses and creators. Any deal, price or payment is between you and the other person.",
      ],
      [
        "Your choices",
        `To change or delete your profile or an enquiry, message us on Instagram @${PLATFORM_IG} and we will do it.`,
      ],
    ],
  },
  gu: {
    title: "પ્રાઇવસી પોલિસી",
    sections: [
      [
        "અમે શું એકત્ર કરીએ છીએ",
        "ક્રિએટર: ઇન્સ્ટાગ્રામ યુઝરનેમ, નામ, પાસવર્ડ (ફક્ત અવાંચ્ય સ્વરૂપમાં સાચવાય છે) અને તમે ભરેલી પ્રોફાઇલની વિગતો. બિઝનેસ: પૂછપરછ ફોર્મમાં તમે લખેલું નામ, બ્રાન્ડ, ફોન નંબર, વૈકલ્પિક ઇમેઇલ અને સંદેશ. સ્પામ રોકવા માટે તમારા ઇન્ટરનેટ એડ્રેસનું સંકેતિત (હેશ કરેલું) સ્વરૂપ થોડા સમય માટે રાખીએ છીએ, વાંચી શકાય તેવા સ્વરૂપમાં નહીં.",
      ],
      [
        "કોણ જોઈ શકે",
        "ચકાસાયેલ ક્રિએટરની જાહેર પ્રોફાઇલ (નામ, યુઝરનેમ, ભાવ, ભરેલી વિગતો) બધા જોઈ શકે છે. બિઝનેસની પૂછપરછની વિગતો ફક્ત જે ક્રિએટરને મોકલી હોય તેને અને સાઇટની ટીમને દેખાય છે. અમે તમારો ડેટા વેચતા નથી અને ફોન નંબર જાહેરમાં બતાવતા નથી.",
      ],
      [
        "કોઈ કમિશન નહીં, કોઈ ચુકવણી નહીં",
        "અમે ફક્ત બિઝનેસ અને ક્રિએટરને જોડીએ છીએ. કોઈ પણ ડીલ, ભાવ કે ચુકવણી તમારી અને સામેની વ્યક્તિ વચ્ચે છે.",
      ],
      [
        "તમારી પસંદગી",
        `તમારી પ્રોફાઇલ કે પૂછપરછ બદલવા અથવા કાઢી નાખવા અમને ઇન્સ્ટાગ્રામ @${PLATFORM_IG} પર મેસેજ કરો, અમે કરી આપીશું.`,
      ],
    ],
  },
} as const;

export default async function PrivacyPage() {
  const { lang } = await getI18n();
  const c = COPY[lang];
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">{c.title}</h1>
      <p className="mt-1 text-muted">{SITE_NAME}</p>
      <div className="mt-6 space-y-6">
        {c.sections.map(([h, body]) => (
          <section key={h}>
            <h2 className="text-xl font-extrabold">{h}</h2>
            <p className="mt-1">{body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
