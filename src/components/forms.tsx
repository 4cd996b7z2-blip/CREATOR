"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { DictKey } from "@/lib/dict";
import { useI18n } from "@/lib/i18n-client";

export function SubmitButton({
  children,
  className = "btn btn-primary w-full",
  name,
  value,
}: {
  children: ReactNode;
  className?: string;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <button type="submit" name={name} value={value} disabled={pending} aria-busy={pending} className={className}>
      {pending ? (
        <>
          <Loader2 size={20} className="animate-spin" aria-hidden />
          {t("sending")}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FieldError({ error }: { error?: string }) {
  const { t } = useI18n();
  if (!error) return null;
  return (
    <p className="field-error" role="alert">
      {t(error as DictKey)}
    </p>
  );
}

export function FormBanner({ error, ok, message }: { error?: string; ok?: boolean; message?: string }) {
  const { t } = useI18n();
  if (error)
    return (
      <p className="form-error" role="alert">
        {t(error as DictKey)}
      </p>
    );
  if (ok)
    return (
      <p className="form-ok" role="status">
        {message ? t(message as DictKey) : t("saved")}
      </p>
    );
  return null;
}

export function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      {children}
      {hint ? <p className="hint">{hint}</p> : null}
      <FieldError error={error} />
    </div>
  );
}

export function ChoiceGroup({
  legend,
  name,
  options,
  type,
  selected = [],
}: {
  legend: string;
  name: string;
  options: { id: string; label: string }[];
  type: "checkbox" | "radio";
  selected?: string[];
}) {
  return (
    <fieldset>
      <legend className="label">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.id} className="choice">
            <input type={type} name={name} value={o.id} defaultChecked={selected.includes(o.id)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
