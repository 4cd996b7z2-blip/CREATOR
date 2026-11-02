"use client";

import { useActionState } from "react";
import { Field, FormBanner, SubmitButton } from "@/components/forms";
import { useI18n } from "@/lib/i18n-client";
import type { FormState } from "@/lib/types";
import { loginCreator } from "../auth/actions";

export function LoginForm() {
  const { t } = useI18n();
  const [state, action] = useActionState<FormState, FormData>(loginCreator, {});
  const v = (k: string) => (state.values?.[k] as string | undefined) ?? "";

  return (
    <form action={action} className="space-y-5" noValidate>
      <FormBanner error={state.error} />
      <Field label={t("f_login_user")} name="handle">
        <input
          id="handle"
          name="handle"
          className="field"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="username"
          defaultValue={v("handle")}
        />
      </Field>
      <Field label={t("f_password_login")} name="password">
        <input id="password" name="password" type="password" className="field" autoComplete="current-password" />
      </Field>
      <SubmitButton>{t("btn_login")}</SubmitButton>
    </form>
  );
}
