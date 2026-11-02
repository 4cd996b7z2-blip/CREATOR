"use client";

import { useActionState } from "react";
import { ChoiceGroup, Field, FormBanner, SubmitButton } from "@/components/forms";
import { CITIES, DEAL_TYPES, LANGUAGES, NICHES, VIDEO_TYPES, toOptions } from "@/lib/constants";
import { useI18n } from "@/lib/i18n-client";
import type { FormState } from "@/lib/types";
import { saveProfile } from "../actions";

export type ProfileInitial = {
  display_name: string;
  city: string;
  niche: string;
  audience: string;
  best_reel_url: string;
  ambition: string;
  price_reel: string;
  languages: string[];
  video_types: string[];
  deal_types: string[];
};

export function ProfileForm({ initial }: { initial: ProfileInitial }) {
  const { t, lang } = useI18n();
  const [state, action] = useActionState<FormState, FormData>(saveProfile, {});
  const s = (k: keyof ProfileInitial) => ((state.values?.[k] as string | undefined) ?? (initial[k] as string)) || "";
  const a = (k: "languages" | "video_types" | "deal_types") => (state.values?.[k] as string[] | undefined) ?? initial[k];
  const err = (k: string) => state.fieldErrors?.[k];

  return (
    <form action={action} className="space-y-6" noValidate>
      <FormBanner ok={state.ok} />

      <Field label={t("f_your_name")} name="display_name" error={err("display_name")}>
        <input
          id="display_name"
          name="display_name"
          className="field"
          defaultValue={s("display_name")}
          aria-invalid={Boolean(err("display_name"))}
          maxLength={60}
        />
      </Field>

      <ChoiceGroup legend={t("f_niche")} name="niche" type="radio" options={toOptions(NICHES, lang)} selected={[s("niche")]} />

      <Field label={t("f_city")} name="city">
        <select id="city" name="city" className="field" defaultValue={s("city") || "Rajkot"}>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <ChoiceGroup legend={t("f_languages")} name="languages" type="checkbox" options={toOptions(LANGUAGES, lang)} selected={a("languages")} />

      <Field label={t("f_audience")} name="audience">
        <textarea
          id="audience"
          name="audience"
          className="field"
          placeholder={t("f_audience_ph")}
          defaultValue={s("audience")}
          maxLength={400}
        />
      </Field>

      <ChoiceGroup legend={t("f_video_types")} name="video_types" type="checkbox" options={toOptions(VIDEO_TYPES, lang)} selected={a("video_types")} />

      <Field label={t("f_best_reel")} name="best_reel_url" error={err("best_reel_url")}>
        <input
          id="best_reel_url"
          name="best_reel_url"
          type="url"
          inputMode="url"
          className="field"
          placeholder="https://www.instagram.com/reel/..."
          defaultValue={s("best_reel_url")}
          aria-invalid={Boolean(err("best_reel_url"))}
        />
      </Field>

      <Field label={t("f_ambition")} name="ambition">
        <textarea
          id="ambition"
          name="ambition"
          className="field"
          style={{ minHeight: "5.5rem" }}
          placeholder={t("f_ambition_ph")}
          defaultValue={s("ambition")}
          maxLength={300}
        />
      </Field>

      <ChoiceGroup legend={t("f_deal_types")} name="deal_types" type="checkbox" options={toOptions(DEAL_TYPES, lang)} selected={a("deal_types")} />

      <Field label={t("f_price")} name="price_reel" error={err("price_reel")} hint={t("f_price_hint")}>
        <input
          id="price_reel"
          name="price_reel"
          inputMode="numeric"
          className="field"
          placeholder="3000"
          defaultValue={s("price_reel")}
          aria-invalid={Boolean(err("price_reel"))}
        />
      </Field>

      <SubmitButton>{t("btn_save")}</SubmitButton>
      <FormBanner ok={state.ok} />
    </form>
  );
}
