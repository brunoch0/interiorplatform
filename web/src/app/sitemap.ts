import type { MetadataRoute } from "next";
import { fetchCompanies } from "@/lib/db";
import { guides } from "@/lib/guides";
import { SITE_URL, areaSlug } from "@/lib/site";
import { allAreas } from "@/lib/area-stats";
import { GUIDE_LOCALES, localizedSlugs } from "@/lib/guide-i18n";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companies = await fetchCompanies();
  // An area with a handful of companies is noindex — submitting it would only
  // ask Google to judge a page we already know is thin.
  const areas = allAreas(companies).filter((a) => a.indexable);

  const statics: MetadataRoute.Sitemap = ["", "/companies", "/areas", "/rankings", "/quote", "/consult", "/requests", "/calculator", "/protection", "/report", "/supplier/license", "/guides", "/projects", "/supplier/showcase"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));

  const localizedGuidePages: MetadataRoute.Sitemap = GUIDE_LOCALES.flatMap((locale) => {
    const slugs = localizedSlugs(locale);
    if (slugs.length === 0) return [];
    return [
      { url: `${SITE_URL}/${locale}/guides`, changeFrequency: "weekly" as const, priority: 0.7 },
      ...slugs.map((slug) => ({
        url: `${SITE_URL}/${locale}/guides/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  });

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const areaPages: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${SITE_URL}/areas/${areaSlug(a.area)}`,
    changeFrequency: "weekly",
    priority: 0.9, // programmatic SEO money pages
  }));

  const companyPages: MetadataRoute.Sitemap = companies.map((c) => ({
    url: `${SITE_URL}/companies/${c.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...statics, ...guidePages, ...localizedGuidePages, ...areaPages, ...companyPages];
}
