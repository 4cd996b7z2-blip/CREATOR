import { Inbox, Phone } from "lucide-react";
import { SubmitButton } from "@/components/forms";
import { WhatsAppIcon } from "@/components/icons";
import { BUDGETS, BUSINESS_TYPES, SITE_NAME, optLabel } from "@/lib/constants";
import type { DictKey } from "@/lib/dict";
import { getI18n } from "@/lib/i18n-server";
import { requireCreator } from "@/lib/session";
import { getStore } from "@/lib/store";
import { formatInr, timeAgo } from "@/lib/utils";
import { updateEnquiryStatus } from "../actions";

export default async function EnquiriesPage() {
  const me = await requireCreator();
  const { t, lang } = await getI18n();
  const enquiries = await getStore().listEnquiries(me.id);

  if (enquiries.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
        <Inbox size={48} className="text-muted" aria-hidden />
        <p className="text-lg font-semibold text-muted">{t("e_empty")}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold">{t("e_title")}</h1>
      <ul className="space-y-4">
        {enquiries.map((e) => {
          const wa = `https://wa.me/91${e.phone}?text=${encodeURIComponent(
            t("e_wa_text", { name: e.contact_name, creator: me.display_name, site: SITE_NAME, brand: e.brand_name }),
          )}`;
          return (
            <li key={e.id} className={`card p-5 ${e.status === "new" ? "border-rani ring-2 ring-rani/20" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-words text-xl font-extrabold leading-tight">{e.brand_name}</h2>
                  <p className="font-semibold">{e.contact_name}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`chip ${e.status === "new" ? "chip-new" : e.status === "booked" ? "chip-leaf" : ""}`}>
                    {t(`status_${e.status}` as DictKey)}
                  </span>
                  <p className="mt-1 text-sm text-muted">{timeAgo(e.created_at, lang)}</p>
                </div>
              </div>

              <p className="mt-3 rounded-xl bg-paper p-3 whitespace-pre-line">{e.message}</p>

              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[0.95rem]">
                {e.business_type ? (
                  <div>
                    <dt className="inline text-muted">{t("e_business")}: </dt>
                    <dd className="inline font-bold">{optLabel(BUSINESS_TYPES, e.business_type, lang)}</dd>
                  </div>
                ) : null}
                {e.budget_band ? (
                  <div>
                    <dt className="inline text-muted">{t("e_budget")}: </dt>
                    <dd className="inline font-bold">{optLabel(BUDGETS, e.budget_band, lang)}</dd>
                  </div>
                ) : null}
                {e.email ? (
                  <div className="min-w-0 break-all">
                    <dd className="font-bold">{e.email}</dd>
                  </div>
                ) : null}
              </dl>

              <p className="mt-4 text-2xl font-extrabold tracking-wide">{e.phone}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <a href={`tel:+91${e.phone}`} className="btn btn-dark">
                  <Phone size={20} aria-hidden />
                  {t("e_call")}
                </a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                  <WhatsAppIcon size={22} />
                  {t("e_whatsapp")}
                </a>
              </div>

              <form action={updateEnquiryStatus} className="mt-4 border-t border-line pt-4">
                <input type="hidden" name="id" value={e.id} />
                <div className="mb-3">
                  <label htmlFor={`price-${e.id}`} className="label">
                    {t("e_price_agreed")}
                  </label>
                  <input
                    id={`price-${e.id}`}
                    name="agreed_price"
                    inputMode="numeric"
                    className="field"
                    defaultValue={e.agreed_price != null ? String(e.agreed_price) : ""}
                    placeholder={e.agreed_price != null ? formatInr(e.agreed_price) : "3000"}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <SubmitButton name="status" value="contacted" className="btn btn-outline btn-sm">
                    {t("status_contacted")}
                  </SubmitButton>
                  <SubmitButton name="status" value="booked" className="btn btn-primary btn-sm">
                    {t("status_booked")}
                  </SubmitButton>
                  <SubmitButton name="status" value="declined" className="btn btn-outline btn-sm">
                    {t("status_declined")}
                  </SubmitButton>
                </div>
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
