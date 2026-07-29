// Lightweight cookie-based i18n — English default, ar/ko/ru packs.
// Server: getLocale() + getDict(); Client: useDict() via I18nProvider.
import { en } from "./en";
import { ar } from "./ar";
import { ko } from "./ko";
import { ru } from "./ru";

export const LOCALES = ["en", "ar", "ko", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export type Dict = typeof en;

export const LOCALE_META: Record<Locale, { label: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
  ko: { label: "한국어", dir: "ltr" },
  ru: { label: "Русский", dir: "ltr" },
};

const DICTS: Record<Locale, Dict> = { en, ar, ko, ru };

export function isLocale(v: string | undefined): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? en;
}

// Server-side helper — reads the NEXT_LOCALE cookie
export async function getLocale(): Promise<Locale> {
  const { cookies } = await import("next/headers");
  const v = (await cookies()).get("NEXT_LOCALE")?.value;
  return isLocale(v) ? v : "en";
}
