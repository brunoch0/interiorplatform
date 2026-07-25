import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fmt } from "@/lib/data";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL, areaSlug } from "@/lib/site";
import ShareButtons from "@/components/share-buttons";
import { Badge, Card, PageHeader } from "@/components/ui";

export const revalidate = 3600;

async function loadArea(slug: string) {
  const companies = await fetchCompanies();
  const areas = [...new Set(companies.map((c) => c.area))];
  const area = areas.find((a) => areaSlug(a) === slug);
  if (!area || area === "Dubai") return null;
  return {
    area,
    companies: companies.filter((c) => c.area === area),
    otherAreas: areas.filter((a) => a !== area && a !== "Dubai").slice(0, 10),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadArea(slug);
  if (!data) return {};
  const title = `Interior Fit-Out Companies in ${data.area}, Dubai (${data.companies.length} listed)`;
  const description = `Compare ${data.companies.length} licensed interior & fit-out contractors in ${data.area}, Dubai. Request free quotes from up to 5 companies — evidence-based comparison, no fake reviews.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/areas/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/areas/${slug}` },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadArea(slug);
  if (!data) notFound();
  const { area, companies, otherAreas } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Interior fit-out companies in ${area}, Dubai`,
    numberOfItems: companies.length,
    itemListElement: companies.slice(0, 20).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/companies/${c.id}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        title={`Interior Companies in ${area}`}
        desc={`${fmt(companies.length)} licensed interior & fit-out contractors based in or serving ${area} — listed from public sources, compared by evidence.`}
        action={<ShareButtons title={`Interior companies in ${area}, Dubai`} path={`/areas/${slug}`} compact />}
      />

      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-cream p-5">
        <p className="text-sm text-gray-500">
          Renovating in {area}? Send one brief, get quotes from up to 5 contractors — free.
        </p>
        <Link href="/quote" className="ml-auto rounded-xl bg-terracotta px-6 py-2.5 text-sm font-bold text-cream hover:bg-terracotta-deep">
          Request quotes →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {companies.map((c) => (
          <Card key={c.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/companies/${c.id}`} className="truncate font-bold hover:underline">{c.name}</Link>
                {c.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="gray">Unclaimed</Badge>}
              </div>
              <p className="mt-0.5 truncate text-xs text-gray-400">{c.categories.slice(0, 3).join(" · ") || "Interior"}</p>
            </div>
            <Link href={`/quote?c=${c.id}`} className="shrink-0 rounded-lg bg-walnut px-4 py-2 text-xs font-bold text-cream hover:bg-walnut-deep">
              Get quote
            </Link>
          </Card>
        ))}
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Other areas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {otherAreas.map((a) => (
            <Link key={a} href={`/areas/${areaSlug(a)}`} className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:border-clay hover:text-charcoal">
              {a}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
