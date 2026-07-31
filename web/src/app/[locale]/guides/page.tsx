import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { guideImage } from "@/lib/guide-images";
import { GUIDE_LOCALES, isGuideLocale, localizedGuide, localizedSlugs } from "@/lib/guide-i18n";
import { GUIDE_CHROME } from "@/lib/guide-i18n/chrome";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_LOCALES.map((locale) => ({ locale }));
}

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isGuideLocale(locale)) return {};
  const t = GUIDE_CHROME[locale];
  return {
    title: t.indexTitle,
    description: t.indexBody,
    alternates: {
      canonical: `${SITE_URL}/${locale}/guides`,
      languages: Object.fromEntries([
        ["en", `${SITE_URL}/guides`],
        ...GUIDE_LOCALES.map((l) => [l, `${SITE_URL}/${l}/guides`]),
      ]),
    },
  };
}

export default async function LocalizedGuidesIndex({ params }: Params) {
  const { locale } = await params;
  if (!isGuideLocale(locale)) notFound();
  const t = GUIDE_CHROME[locale];
  const slugs = localizedSlugs(locale);
  if (slugs.length === 0) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">{t.kicker}</p>
      <h1 className="mt-3 text-3xl md:text-4xl">{t.indexTitle}</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-500">{t.indexBody}</p>
      <p className="mt-4 text-xs text-gray-400">{t.translatedNotice}</p>

      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {slugs.map((slug) => {
          const g = localizedGuide(locale, slug)!;
          return (
            <Link
              key={slug}
              href={`/${locale}/guides/${slug}`}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-cream transition hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={guideImage(slug, g.category, 700)} alt="" className="aspect-[21/9] w-full object-cover" />
              <div className="p-5">
                <h2 className="font-bold leading-snug group-hover:text-terracotta-deep">{g.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">{g.description}</p>
                <p className="mt-3 text-xs text-gray-400">{g.readMinutes} {t.minRead}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
