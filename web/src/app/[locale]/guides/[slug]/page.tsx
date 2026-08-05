import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { guideImage } from "@/lib/guide-images";
import {
  GUIDE_LOCALES,
  isGuideLocale,
  localizedGuide,
  localizedSlugs,
  translatedLocalesFor,
} from "@/lib/guide-i18n";
import GuideArticle from "@/components/guide-article";

// Only the locales we actually have translations for exist; anything else 404s
// instead of being generated on demand under a language it isn't written in.
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_LOCALES.flatMap((locale) =>
    localizedSlugs(locale).map((slug) => ({ locale, slug })),
  );
}

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isGuideLocale(locale)) return {};
  const g = localizedGuide(locale, slug);
  if (!g) return {};
  const url = `${SITE_URL}/${locale}/guides/${slug}`;
  return {
    title: g.title,
    description: g.description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries([
        ["en", `${SITE_URL}/guides/${slug}`],
        ["x-default", `${SITE_URL}/guides/${slug}`],
        ...translatedLocalesFor(slug).map((l) => [l, `${SITE_URL}/${l}/guides/${slug}`]),
      ]),
    },
    openGraph: {
      title: g.title,
      description: g.description,
      url,
      type: "article",
      images: [{ url: guideImage(slug, g.category, 1200), width: 1200, height: 675 }],
    },
  };
}

export default async function LocalizedGuidePage({ params }: Params) {
  const { locale, slug } = await params;
  if (!isGuideLocale(locale)) notFound();
  const g = localizedGuide(locale, slug);
  if (!g) notFound();

  // Article/FAQ schema in the page's own language, pointing at the localised URL
  const url = `${SITE_URL}/${locale}/guides/${slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    inLanguage: locale,
    dateModified: g.updated,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    translationOfWork: { "@type": "Article", "@id": `${SITE_URL}/guides/${slug}` },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: g.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const others = localizedSlugs(locale)
    .filter((s) => s !== slug)
    .map((s) => ({ slug: s, title: localizedGuide(locale, s)!.title }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <GuideArticle g={g} locale={locale} otherSlugs={others} />
    </>
  );
}
