import type { MetadataRoute } from "next";
import { fetchCompanies } from "@/lib/db";
import { guides } from "@/lib/guides";
import { SITE_URL, areaSlug } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companies = await fetchCompanies();
  const areas = [...new Set(companies.map((c) => c.area))].filter((a) => a !== "Dubai");

  const statics: MetadataRoute.Sitemap = ["", "/companies", "/quote", "/onboarding", "/supplier/license", "/guides", "/projects", "/supplier/showcase"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const areaPages: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${SITE_URL}/areas/${areaSlug(a)}`,
    changeFrequency: "weekly",
    priority: 0.9, // programmatic SEO money pages
  }));

  const companyPages: MetadataRoute.Sitemap = companies.map((c) => ({
    url: `${SITE_URL}/companies/${c.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...statics, ...guidePages, ...areaPages, ...companyPages];
}
