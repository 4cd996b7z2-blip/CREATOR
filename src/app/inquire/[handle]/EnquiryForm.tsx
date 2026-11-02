"use client";

import { useActionState } from "react";
import { Field, FieldError, FormBanner, SubmitButton } from "@/components/forms";
import { BUDGETS, BUSINESS_TYPES, toOptions } from "@/lib/constants";
import { useI18n } from "@/lib/i18n-client";
import type { FormState } from "@/lib/types";
import { submitEnquiry } from "../actions";

export function EnquiryForm({ handle, issuedAt }: { handle: string; issuedAt: string }) {
  const { t, lang } = useI18n();
  const [state, action] = useActionState<FormState, FormData>(submitEnquiry, {});

  const v = (k: string) => (state.values?.[k] as string | undefined) ?? "";
  const err = (k: string) => state.fieldErrors?.[k];

  return (
    <form action={action} className="space-y-5" noValidate>
      <FormBanner error={state.error} />
      <input type="hidden" name="handle" value={handle} />
      <input type="hidden" name="t" value={issuedAt} />
      {/* honeypot: invisible to people, tempting to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label={t("f_your_name")} name="contact_name" error={err("contact_name")}>
        <input
          id="contact_name"
          name="contact_name"
          className="field"
          autoComplete="name"
          defaultValue={v("contact_name")}
          aria-invalid={Boolean(err("contact_name"))}
          maxLength={80}
        />
      </Field>

      <Field label={t("f_brand")} name="brand_name" error={err("brand_name")}>
        <input
          id="brand_name"
          name="brand_name"
          className="field"
          autoComplete="organization"
          defaultValue={v("brand_name")}
          aria-invalid={Boolean(err("brand_name"))}
          maxLength={100}
        />
      </Field>

      <Field label={t("f_phone")} name="phone" error={err("phone")} hint={t("f_phone_hint")}>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          className="field"
          autoComplete="tel-national"
          defaultValue={v("phone")}
          aria-invalid={Boolean(err("phone"))}
          maxLength={16}
        />
      </Field>

      <Field label={t("f_business_type")} name="business_type">
        <select id="business_type" name="business_type" className="field" defaultValue={v("business_type")}>
          <option value="">{t("select_ph")}</option>
          {toOptions(BUSINESS_TYPES, lang).map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("f_budget")} name="budget_band">
        <select id="budget_band" name="budget_band" className="field" defaultValue={v("budget_band")}>
          <option value="">{t("select_ph")}</option>
          {toOptions(BUDGETS, lang).map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("f_message")} name="message" error={err("message")}>
        <textarea
          id="message"
          name="message"
          className="field"
          placeholder={t("f_message_ph")}
          defaultValue={v("message")}
          aria-invalid={Boolean(err("message"))}
          maxLength={1000}
        />
      </Field>

      <Field label={t("f_email")} name="email" error={err("email")}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          className="field"
          autoComplete="email"
          defaultValue={v("email")}
          aria-invalid={Boolean(err("email"))}
          maxLength={120}
        />
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3 font-semibold">
          <input type="checkbox" name="consent" className="mt-1 h-6 w-6 shrink-0 accent-[#1b1f4b]" />
          <span>{t("f_consent_enq")}</span>
        </label>
        <FieldError error={err("consent")} />
      </div>

      <SubmitButton>{t("btn_send")}</SubmitButton>
    </form>
  );
}
