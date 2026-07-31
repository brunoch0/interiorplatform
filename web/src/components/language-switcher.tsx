"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/provider";
import { GUIDE_LOCALES } from "@/lib/guide-i18n";

const PREFIXES = GUIDE_LOCALES as readonly string[];

/** Strip a leading /ar|/ru|/ko so the path can be re-prefixed for the new language. */
function stripLocale(path: string) {
  const seg = path.split("/")[1];
  return PREFIXES.includes(seg) ? path.slice(seg.length + 1) || "/" : path;
}

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const change = (next: Locale) => {
    setLocale(next);
    // Guides are fully translated at their own URLs, so send the reader there
    // rather than leaving them on the English article with translated chrome.
    const bare = stripLocale(pathname);
    if (bare.startsWith("/guides")) {
      router.push(next === "en" ? bare : `/${next}${bare}`);
    } else if (pathname !== bare) {
      router.push(bare);
    }
  };

  return (
    <label className="inline-flex items-center gap-1 text-xs text-gray-400">
      <Globe className="h-3.5 w-3.5" strokeWidth={1.75} />
      <select
        value={locale}
        onChange={(e) => change(e.target.value as Locale)}
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
