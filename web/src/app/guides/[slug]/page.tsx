import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides } from "@/lib/guides";
import { guideImage } from "@/lib/guide-images";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import GuideArticle from "@/components/guide-article";
import { translatedLocalesFor } from "@/lib/guide-i18n";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: {
      canonical: `${SITE_URL}/guides/${g.slug}`,
      languages: Object.fromEntries([
        ["en", `${SITE_URL}/guides/${g.slug}`],
        // Fallback for searchers whose language matches none of ours
        ["x-default", `${SITE_URL}/guides/${g.slug}`],
        ...translatedLocalesFor(g.slug).map((l) => [l, `${SITE_URL}/${l}/guides/${g.slug}`]),
      ]),
    },
    openGraph: {
      title: g.title,
      description: g.description,
      url: `${SITE_URL}/guides/${g.slug}`,
      type: "article",
      images: [{ url: guideImage(g.slug, g.category, 1200), width: 1200, height: 675 }],
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    dateModified: g.updated,
    inLanguage: "en",
    image: guideImage(g.slug, g.category, 1200),
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/guides/${g.slug}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    about: { "@type": "Thing", name: g.category },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: g.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <GuideArticle g={g} />
    </>
  );
}
