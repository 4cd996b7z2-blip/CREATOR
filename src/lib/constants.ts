import type { Lang } from "./dict";

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Rajkot Creators";
export const PLATFORM_IG = (process.env.NEXT_PUBLIC_PLATFORM_IG || "rajkotcreators").replace(/^@/, "");

export type Opt = { id: string; en: string; gu: string };

export const NICHES: Opt[] = [
  { id: "food", en: "Food & Cafes", gu: "ખાણીપીણી અને કાફે" },
  { id: "fashion", en: "Fashion & Jewellery", gu: "ફેશન અને જ્વેલરી" },
  { id: "beauty", en: "Beauty & Salon", gu: "બ્યુટી અને સલૂન" },
  { id: "fitness", en: "Fitness & Gym", gu: "ફિટનેસ અને જીમ" },
  { id: "travel", en: "Travel", gu: "પ્રવાસ" },
  { id: "tech", en: "Tech & Gadgets", gu: "ટેક અને ગેજેટ" },
  { id: "comedy", en: "Comedy & Entertainment", gu: "કોમેડી અને મનોરંજન" },
  { id: "lifestyle", en: "Lifestyle & Vlogs", gu: "લાઇફસ્ટાઇલ અને વ્લોગ" },
  { id: "education", en: "Education & Coaching", gu: "શિક્ષણ અને કોચિંગ" },
  { id: "business", en: "Business & Finance", gu: "બિઝનેસ અને ફાઇનાન્સ" },
  { id: "realestate", en: "Real Estate & Auto", gu: "રિયલ એસ્ટેટ અને ઓટો" },
  { id: "other", en: "Other", gu: "બીજું" },
];

export const LANGUAGES: Opt[] = [
  { id: "gu", en: "Gujarati", gu: "ગુજરાતી" },
  { id: "hi", en: "Hindi", gu: "હિન્દી" },
  { id: "en", en: "English", gu: "અંગ્રેજી" },
];

export const VIDEO_TYPES: Opt[] = [
  { id: "reels", en: "Reels", gu: "રીલ્સ" },
  { id: "vlog", en: "Vlogs", gu: "વ્લોગ" },
  { id: "review", en: "Reviews", gu: "રિવ્યુ" },
  { id: "comedy", en: "Comedy skits", gu: "કોમેડી" },
  { id: "tutorial", en: "Tutorials", gu: "ટ્યુટોરિયલ" },
  { id: "event", en: "Event coverage", gu: "ઇવેન્ટ કવરેજ" },
  { id: "product", en: "Product shoots", gu: "પ્રોડક્ટ શૂટ" },
];

export const DEAL_TYPES: Opt[] = [
  { id: "paid", en: "Paid promotion", gu: "પેઇડ પ્રમોશન" },
  { id: "barter", en: "Free product or meal", gu: "ફ્રી પ્રોડક્ટ કે ભોજન" },
  { id: "commission", en: "Commission on sales", gu: "વેચાણ પર કમિશન" },
];

export const BUDGETS: Opt[] = [
  { id: "under5k", en: "Under ₹5,000", gu: "₹5,000 થી ઓછું" },
  { id: "5k-15k", en: "₹5,000 to ₹15,000", gu: "₹5,000 થી ₹15,000" },
  { id: "15k-50k", en: "₹15,000 to ₹50,000", gu: "₹15,000 થી ₹50,000" },
  { id: "50k+", en: "Above ₹50,000", gu: "₹50,000 થી વધુ" },
  { id: "unsure", en: "Not sure yet", gu: "હજી નક્કી નથી" },
];

export const BUSINESS_TYPES: Opt[] = [
  { id: "cafe", en: "Restaurant or cafe", gu: "રેસ્ટોરન્ટ કે કાફે" },
  { id: "salon", en: "Salon or spa", gu: "સલૂન કે સ્પા" },
  { id: "gym", en: "Gym or studio", gu: "જીમ કે સ્ટુડિયો" },
  { id: "clinic", en: "Clinic or hospital", gu: "ક્લિનિક કે હોસ્પિટલ" },
  { id: "shop", en: "Shop, boutique or jewellery", gu: "દુકાન, બુટિક કે જ્વેલરી" },
  { id: "coaching", en: "Classes or coaching", gu: "ક્લાસ કે કોચિંગ" },
  { id: "realestate", en: "Real estate or auto", gu: "રિયલ એસ્ટેટ કે ઓટો" },
  { id: "other", en: "Other", gu: "બીજું" },
];

export const CITIES = ["Rajkot", "Morbi", "Jamnagar", "Gondal", "Jetpur", "Junagadh", "Bhavnagar", "Surendranagar", "Other"];

export function optLabel(list: Opt[], id: string | null | undefined, lang: Lang): string {
  if (!id) return "";
  const o = list.find((x) => x.id === id);
  return o ? o[lang] : id;
}

export function optLabels(list: Opt[], ids: string[], lang: Lang): string[] {
  return ids.map((i) => optLabel(list, i, lang)).filter(Boolean);
}

export function toOptions(list: Opt[], lang: Lang) {
  return list.map((o) => ({ id: o.id, label: o[lang] }));
}
