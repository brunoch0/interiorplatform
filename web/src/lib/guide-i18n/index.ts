import { guides, type Guide } from "@/lib/guides";
import ar from "./ar.json";
import ru from "./ru.json";
import ko from "./ko.json";

/** Locales the guides are translated into. English lives at the unprefixed path. */
export const GUIDE_LOCALES = ["ar", "ru", "ko"] as const;
export type GuideLocale = (typeof GUIDE_LOCALES)[number];

type Translated = Pick<Guide, "title" | "description" | "intro" | "sections" | "faqs">;
type Bundle = Record<string, Translated>;

const BUNDLES: Record<GuideLocale, Bundle> = {
  ar: ar as Bundle,
  ru: ru as Bundle,
  ko: ko as Bundle,
};

export function isGuideLocale(v: string): v is GuideLocale {
  return (GUIDE_LOCALES as readonly string[]).includes(v);
}

/**
 * A guide in the requested locale, or null when that translation does not exist
 * yet — callers 404 rather than silently serving English under a localised URL.
 */
export function localizedGuide(locale: GuideLocale, slug: string): Guide | null {
  const base = guides.find((g) => g.slug === slug);
  const t = BUNDLES[locale]?.[slug];
  if (!base || !t) return null;
  // Structure, dates, images and official links stay from the English source
  return { ...base, ...t };
}

/** Slugs available in a locale, in the same order as the English index. */
export function localizedSlugs(locale: GuideLocale): string[] {
  const bundle = BUNDLES[locale] ?? {};
  return guides.filter((g) => bundle[g.slug]).map((g) => g.slug);
}

export function hasTranslation(locale: GuideLocale, slug: string): boolean {
  return Boolean(BUNDLES[locale]?.[slug]);
}

/** Locales a given guide is translated into — used to emit hreflang alternates. */
export function translatedLocalesFor(slug: string): GuideLocale[] {
  return GUIDE_LOCALES.filter((l) => hasTranslation(l, slug));
}
