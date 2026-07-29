"use client";

import { Globe } from "lucide-react";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/provider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <label className="inline-flex items-center gap-1 text-xs text-gray-400">
      <Globe className="h-3.5 w-3.5" strokeWidth={1.75} />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label="Language"
        className="cursor-pointer bg-transparent text-xs text-gray-500 outline-none hover:text-charcoal"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>{LOCALE_META[l].label}</option>
        ))}
      </select>
    </label>
  );
}
