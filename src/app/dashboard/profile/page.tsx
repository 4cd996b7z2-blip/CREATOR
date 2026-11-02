import { getI18n } from "@/lib/i18n-server";
import { requireCreator } from "@/lib/session";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const me = await requireCreator();
  const { t } = await getI18n();
  return (
    <div className="card p-5 md:p-7">
      <h1 className="text-2xl font-extrabold">{t("p_title")}</h1>
      <p className="mb-6 mt-1 text-muted">{t("p_sub")}</p>
      <ProfileForm
        initial={{
          display_name: me.display_name,
          city: me.city,
          niche: me.niche ?? "",
          audience: me.audience ?? "",
          best_reel_url: me.best_reel_url ?? "",
          ambition: me.ambition ?? "",
          price_reel: me.price_reel != null ? String(me.price_reel) : "",
          languages: me.languages,
          video_types: me.video_types,
          deal_types: me.deal_types,
        }}
      />
    </div>
  );
}
