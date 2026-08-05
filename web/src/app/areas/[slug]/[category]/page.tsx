import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fmt } from "@/lib/data";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL, SITE_NAME, areaSlug, mapsUrl } from "@/lib/site";
import { areaCategories, categorySlug, byReviews, TOP_RATED_MIN, MIN_INDEXABLE } from "@/lib/area-stats";
import ShareButtons from "@/components/share-buttons";
import { Badge, PageHeader, Stat } from "@/components/ui";

export const revalidate = 3600;

async function load(slug: string, category: string) {
  const all = areaCategories(await fetchCompanies());
  const hit = all.find((x) => areaSlug(x.area) === slug && categorySlug(x.category) === category);
  if (!hit) return null;
  return {
    hit,
    // Siblings give a searcher who picked the wrong combination somewhere to go
    // without leaving the site.
    sameArea: all.filter((x) => x.area === hit.area && x.category !== hit.category && x.indexable),
    sameCategory: all.filter((x) => x.category === hit.category && x.area !== hit.area && x.indexable),
  };
}

const rating = (n: number | null | undefined) => (n == null ? "—" : n.toFixed(1));

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string }> }): Promise<Metadata> {
  const { slug, category } = await params;
  const data = await load(slug, category);
  if (!data) return {};
  const { hit } = data;
  const title = `${hit.category} Companies in ${hit.area}, Dubai — ${fmt(hit.companies.length)} Compared`;
  const noSite = hit.companies.filter((c) => !c.website).length;
  const description = `${fmt(hit.companies.length)} ${hit.category.toLowerCase()} companies in ${hit.area}, Dubai, compared by Google review volume${noSite ? ` — including ${fmt(noSite)} with no website of their own` : ""}. Free quotes.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/areas/${slug}/${category}` },
    openGraph: { title, description, url: `${SITE_URL}/areas/${slug}/${category}` },
    ...(hit.indexable ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function AreaCategoryPage({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const data = await load(slug, category);
  if (!data) notFound();
  const { hit, sameArea, sameCategory } = data;

  const ranked = [...hit.companies].sort(byReviews);
  const rated = hit.companies.filter((c) => c.googleRating != null);
  const totalReviews = hit.companies.reduce((n, c) => n + (c.googleRatingCount ?? 0), 0);
  const avg = rated.length ? rated.reduce((n, c) => n + (c.googleRating ?? 0), 0) / rated.length : null;
  const topRated = rated.filter((c) => (c.googleRating ?? 0) >= TOP_RATED_MIN).length;
  const noSite = hit.companies.filter((c) => !c.website).length;

  const lead =
    `${fmt(hit.companies.length)} companies in ${hit.area} list ${hit.category.toLowerCase()} among their specialisms. ` +
    (rated.length
      ? `${fmt(rated.length)} carry a public Google rating, averaging ${avg?.toFixed(2)} across ${fmt(totalReviews)} reviews, and ${fmt(topRated)} sit at ${TOP_RATED_MIN} or above. `
      : "") +
    (noSite
      ? `${fmt(noSite)} of them have no website of their own — which says nothing about their work, but does mean a phone call is the only way to reach them.`
      : "All of them publish a website.");

  const faqs = [
    {
      q: `How many ${hit.category.toLowerCase()} companies are there in ${hit.area}?`,
      a: `${fmt(hit.companies.length)} in our directory list ${hit.category.toLowerCase()} as a specialism. ${
        rated.length ? `${fmt(rated.length)} have a public Google rating averaging ${avg?.toFixed(2)} from ${fmt(totalReviews)} reviews.` : ""
      }`,
    },
    {
      q: `How do I check a ${hit.area} ${hit.category.toLowerCase()} company is legitimate?`,
      a: `Ask for the trade licence and confirm the fit-out activity is on it — you can check any Dubai company on Invest in Dubai. A missing website is not a red flag on its own, but no licence, no written scope and a request for a large upfront payment together are.`,
    },
    {
      q: `Do these companies only work in ${hit.area}?`,
      a: `No. ${hit.area} is where they are registered or based; Dubai contractors travel across the whole city. Workshops cluster in industrial districts, so the address tells you where the joinery is made rather than where the work happens.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${hit.category} companies in ${hit.area}, Dubai`,
    numberOfItems: hit.companies.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: ranked.slice(0, 25).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/companies/${c.id}`,
    })),
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // No UTM on an internal link — it would restart the GA4 session and bury the
  // real source. `src` rides through to the lead row instead.
  const quoteHref = `/quote?src=${encodeURIComponent(`areas/${slug}/${category}`)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <PageHeader
        title={`${hit.category} Companies in ${hit.area}, Dubai`}
        action={<ShareButtons title={`${hit.category} companies in ${hit.area}, Dubai`} path={`/areas/${slug}/${category}`} compact />}
      />

      <p className="max-w-3xl text-[15px] leading-relaxed text-gray-600">{lead}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Companies" value={fmt(hit.companies.length)} sub={`${hit.category} in ${hit.area}`} />
        <Stat label="Average rating" value={avg ? avg.toFixed(2) : "—"} sub={`${fmt(rated.length)} rated`} />
        <Stat label="Reviews analysed" value={fmt(totalReviews)} sub="Google Maps" />
        <Stat label="No own website" value={fmt(noSite)} sub={`of ${fmt(hit.companies.length)}`} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-cream p-5">
        <p className="text-sm text-gray-500">
          Need {hit.category.toLowerCase()} work in {hit.area}? One brief, quotes from up to 5 of these companies — free.
        </p>
        <Link href={quoteHref} className="ml-auto rounded-xl bg-terracotta px-6 py-2.5 text-sm font-bold text-cream hover:bg-terracotta-deep">
          Request quotes →
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold">All {fmt(hit.companies.length)} companies, by review volume</h2>
        <p className="mt-1 text-sm text-gray-500">
          Public Google Maps data. We rank by number of reviews, not by score — volume is harder to influence.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-cream">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
                <th className="px-4 py-2.5 font-semibold">#</th>
                <th className="px-4 py-2.5 font-semibold">Company</th>
                <th className="px-4 py-2.5 font-semibold">Rating</th>
                <th className="px-4 py-2.5 font-semibold">Reviews</th>
                <th className="px-4 py-2.5 font-semibold">Website</th>
                <th className="px-4 py-2.5 font-semibold">Also does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ranked.map((c, i) => (
                <tr key={c.id}>
                  <td className="px-4 py-2.5 font-mono text-gray-400">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <Link href={`/companies/${c.id}`} className="font-semibold text-charcoal hover:underline">{c.name}</Link>
                    {c.placeId && (
                      <a href={mapsUrl(c.name, c.placeId)} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-gray-400 hover:text-terracotta-deep">Maps ↗</a>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-600">{rating(c.googleRating)}</td>
                  <td className="px-4 py-2.5 font-mono text-gray-600">{fmt(c.googleRatingCount ?? 0)}</td>
                  <td className="px-4 py-2.5">
                    {c.website ? <Badge tone="green">Yes</Badge> : <Badge tone="amber">None</Badge>}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">
                    {c.categories.filter((x) => x !== hit.category).slice(0, 2).join(" · ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-gray-400">
          Listed from public sources. Ratings and review counts are public Google Maps data refreshed monthly; a company
          with no website is simply one we found no site for. We publish only what is on the public record — nothing
          about pricing, payment terms or how a company deals with customers is inferred. Placement cannot be bought.
        </p>
      </section>

      <section className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold">{hit.category} in {hit.area} — quick answers</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-gray-200 bg-cream p-4">
              <p className="font-semibold">{f.q}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {sameArea.length > 0 && (
        <section className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Other work in {hit.area}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sameArea.map((x) => (
              <Link key={x.category} href={`/areas/${slug}/${categorySlug(x.category)}`}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:border-clay hover:text-charcoal">
                {x.category} <span className="text-gray-400">{fmt(x.companies.length)}</span>
              </Link>
            ))}
            <Link href={`/areas/${slug}`} className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-semibold text-terracotta-deep hover:border-clay">
              All {hit.area} companies →
            </Link>
          </div>
        </section>
      )}

      {sameCategory.length > 0 && (
        <section className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{hit.category} elsewhere in Dubai</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sameCategory.map((x) => (
              <Link key={x.area} href={`/areas/${areaSlug(x.area)}/${category}`}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:border-clay hover:text-charcoal">
                {x.area} <span className="text-gray-400">{fmt(x.companies.length)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!hit.indexable && (
        <p className="mt-10 text-xs text-gray-400">
          Fewer than {MIN_INDEXABLE} companies match this combination, so this page is not submitted to search engines —
          the fuller lists above are the better place to start. {SITE_NAME}
        </p>
      )}
    </div>
  );
}
