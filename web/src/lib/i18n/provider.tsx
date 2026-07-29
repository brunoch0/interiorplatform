"use client";

// Client-side locale swap: pages stay statically cached in English (SEO canon),
// then re-render in the cookie locale after hydration. Arabic flips document dir.
import { createContext, useContext, useEffect, useState } from "react";
import { LOCALE_META, getDict, isLocale, type Dict, type Locale } from "./index";

type I18nCtx = { locale: Locale; dict: Dict; setLocale: (l: Locale) => void };

const Ctx = createContext<I18nCtx>({ locale: "en", dict: getDict("en"), setLocale: () => {} });

export function useI18n() {
  return useContext(Ctx);
}

export function tmpl(s: string, vars: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

function readCookieLocale(): Locale {
  const m = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  const v = m?.[1];
  return isLocale(v) ? v : "en";
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const l = readCookieLocale();
    if (l !== "en") applyLocale(l);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyLocale = (l: Locale) => {
    setLocaleState(l);
    document.documentElement.lang = l;
    document.documentElement.dir = LOCALE_META[l].dir;
  };

  const setLocale = (l: Locale) => {
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    applyLocale(l);
  };

  return <Ctx.Provider value={{ locale, dict: getDict(locale), setLocale }}>{children}</Ctx.Provider>;
}
