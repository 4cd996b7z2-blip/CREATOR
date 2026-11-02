"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FieldError, FormBanner, SubmitButton } from "@/components/forms";
import { useI18n } from "@/lib/i18n-client";
import type { FormState } from "@/lib/types";
import { registerCreator } from "../auth/actions";

export function RegisterForm() {
  const { t } = useI18n();
  const [state, action] = useActionState<FormState, FormData>(registerCreator, {});
  const v = (k: string) => (state.values?.[k] as string | undefined) ?? "";
  const err = (k: string) => state.fieldErrors?.[k];

  return (
    <form action={action} className="space-y-5" noValidate>
      <FormBanner error={state.error} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label={t("f_ig")} name="handle" error={err("handle")} hint={t("f_ig_hint")}>
        <input
          id="handle"
          name="handle"
          className="field"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="username"
          defaultValue={v("handle")}
          aria-invalid={Boolean(err("handle"))}
        />
      </Field>

      <Field label={t("f_your_name")} name="display_name" error={err("display_name")}>
        <input
          id="display_name"
          name="display_name"
          className="field"
          autoComplete="name"
          defaultValue={v("display_name")}
          aria-invalid={Boolean(err("display_name"))}
          maxLength={60}
        />
      </Field>

      <Field label={t("f_password")} name="password" error={err("password")}>
        <input
          id="password"
          name="password"
          type="password"
          className="field"
          autoComplete="new-password"
          aria-invalid={Boolean(err("password"))}
        />
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3 font-semibold">
          <input type="checkbox" name="consent" className="mt-1 h-6 w-6 shrink-0 accent-[#1b1f4b]" />
          <span>
            {t("f_consent_reg")}{" "}
            <Link href="/privacy" className="underline">
              {t("nav_privacy")}
            </Link>
          </span>
        </label>
        <FieldError error={err("consent")} />
      </div>

      <SubmitButton>{t("btn_register")}</SubmitButton>
    </form>
  );
}
