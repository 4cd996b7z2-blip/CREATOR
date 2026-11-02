import { setLang } from "@/app/lang/actions";
import { getLang } from "@/lib/i18n-server";

export async function LangToggle() {
  const lang = await getLang();
  const base = "min-h-10 px-3 rounded-full text-sm font-bold transition-colors";
  const on = "bg-marigold text-ink";
  const off = "text-white/85 hover:bg-white/10";
  return (
    <form action={setLang} className="flex items-center rounded-full border border-white/25 p-0.5" aria-label="Language">
      <button
        name="lang"
        value="gu"
        aria-pressed={lang === "gu"}
        aria-label="ગુજરાતી"
        className={`${base} ${lang === "gu" ? on : off}`}
      >
        <span className="sm:hidden">ગુ</span>
        <span className="hidden sm:inline">ગુજરાતી</span>
      </button>
      <button
        name="lang"
        value="en"
        aria-pressed={lang === "en"}
        aria-label="English"
        className={`${base} ${lang === "en" ? on : off}`}
      >
        <span className="sm:hidden">EN</span>
        <span className="hidden sm:inline">English</span>
      </button>
    </form>
  );
}
