import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/project", "/contract", "/quote/compare", "/quote/confirm", "/signup", "/supplier/leads", "/supplier/packages", "/supplier/profile"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
