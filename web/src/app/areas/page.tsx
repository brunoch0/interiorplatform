import Link from "next/link";
import type { Metadata } from "next";
import { fmt } from "@/lib/data";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL, SITE_NAME, areaSlug } from "@/lib/site";
import { allAreas, directoryStats, MIN_INDEXABLE } from "@/lib/area-stats";
import ShareButtons from "@/components/share-buttons";
import { PageHeader } from "@/components/ui";

export const revalidate = 3600;

const TITLE = "Interior Fit-Out Companies in Dubai, by Area";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Every Dubai area with licensed interior and fit-out companies, compared by company count, average Google rating and review volume. Pick your area and request free quotes.",
  alternates: { canonical: `${SITE_URL}/areas` },
  openGraph: { title: TITLE, url: `${SITE_URL}/areas` },
};

const rating = (n: number | null) => (n == null ? "—" : n.toFixed(2));

export default async function AreasIndex() {
  const companies = await fetchCompanies();
  const areas = allAreas(companies);
  const d = directoryStats(companies);
  const listed = areas.filter((a) => a.indexable);
  const small = areas.filter((a) => !a.indexable);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: TITLE,
    numberOfItems: listed.length,
    itemListElement: listed.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Interior fit-out companies in ${a.area}`,
      url: `${SITE_URL}/areas/${areaSlug(a.area)}`,
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHeader title={TITLE} action={<ShareButtons title={TITLE} path="/areas" compact />} />

      <p className="max-w-3xl text-[15px] leading-relaxed text-gray-600">
        {SITE_NAME} lists {fmt(d.total)} licensed interior and fit-out companies across {d.areaCount} Dubai areas.
        Fit-out workshops cluster in industrial districts rather than the communities they work in, so the area with the
        most companies is rarely the area you live in — {areas[0]?.area} alone accounts for{" "}
        {fmt(areas[0]?.companies.length ?? 0)}. Contractors travel across Dubai, so treat this as a supply map, not a
        catchment.
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-cream">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
              <th className="px-4 py-2.5 font-semibold">Area</th>
              <th className="px-4 py-2.5 font-semibold">Companies</th>
              <th className="px-4 py-2.5 font-semibold">Avg rating</th>
              <th className="px-4 py-2.5 font-semibold">Reviews</th>
              <th className="px-4 py-2.5 font-semibold">Top specialism</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listed.map((a) => (
              <tr key={a.area}>
                <td className="px-4 py-2.5">
                  <Link href={`/areas/${areaSlug(a.area)}`} className="font-semibold text-charcoal hover:underline">{a.area}</Link>
                </td>
                <td className="px-4 py-2.5 font-mono text-gray-600">{fmt(a.companies.length)}</td>
                <td className="px-4 py-2.5 font-mono text-gray-600">{rating(a.avgRating)}</td>
                <td className="px-4 py-2.5 font-mono text-gray-600">{fmt(a.totalReviews)}</td>
                <td className="px-4 py-2.5 text-xs text-gray-500">{a.categories[0]?.name ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {small.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Areas with only a handful of companies</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-gray-500">
            Fewer than {MIN_INDEXABLE} companies are registered in these areas, so there is not enough there to compare.
            Contractors from the areas above work across all of them — start from the full directory instead.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {small.map((a) => (
              <Link key={a.area} href={`/areas/${areaSlug(a.area)}`} className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:border-clay hover:text-charcoal">
                {a.area} <span className="text-gray-400">{fmt(a.companies.length)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-walnut p-8 text-cream md:flex-row md:items-center">
        <div>
          <p className="font-serif text-xl">Not sure which area matters?</p>
          <p className="mt-1 text-sm text-slate-300">Send one brief and get quotes from up to 5 licensed contractors — free.</p>
        </div>
        <Link href="/quote" className="shrink-0 rounded-xl bg-terracotta px-6 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep">
          Request quotes
        </Link>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        See also: <Link href="/rankings" className="font-semibold text-terracotta-deep hover:underline">most-reviewed companies in Dubai</Link> ·{" "}
        <Link href="/companies" className="font-semibold text-terracotta-deep hover:underline">full directory</Link>
      </p>
    </div>
  );
}
