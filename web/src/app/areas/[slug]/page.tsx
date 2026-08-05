import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fmt } from "@/lib/data";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL, SITE_NAME, areaSlug, mapsUrl } from "@/lib/site";
import { allAreas, categorySlug, MIN_INDEXABLE, TOP_RATED_MIN, type AreaStats } from "@/lib/area-stats";
import ShareButtons from "@/components/share-buttons";
import { Badge, Card, PageHeader, Stat } from "@/components/ui";

export const revalidate = 3600;

async function loadArea(slug: string) {
  const areas = allAreas(await fetchCompanies());
  const stats = areas.find((a) => areaSlug(a.area) === slug);
  if (!stats) return null;
  return {
    stats,
    // Rank by company count is what makes each page's numbers comparable.
    rank: areas.indexOf(stats) + 1,
    areaCount: areas.length,
    peers: areas.filter((a) => a.area !== stats.area && a.indexable).slice(0, 8),
  };
}

const rating = (n: number | null) => (n == null ? "—" : n.toFixed(2));

/** One liftable sentence. LLM answer engines quote this; humans read it as the summary. */
function leadParagraph(s: AreaStats, rank: number | null) {
  const top = s.categories[0];
  const parts = [
    `${s.area} has ${fmt(s.companies.length)} interior and fit-out companies listed on ${SITE_NAME}` +
      (rank === 1 ? " — the largest concentration of any Dubai area we track." : "."),
  ];
  if (s.ratedCount && s.avgRating) {
    parts.push(
      `${fmt(s.ratedCount)} of them carry a public Google rating, averaging ${rating(s.avgRating)} across ${fmt(s.totalReviews)} reviews, and ${fmt(s.topRated.length)} sit at ${TOP_RATED_MIN} or above.`,
    );
  }
  if (top) {
    parts.push(`The most common specialism here is ${top.name} (${fmt(top.count)} companies).`);
  }
  return parts.join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadArea(slug);
  if (!data) return {};
  const { stats: s } = data;
  const title = `Interior Fit-Out Companies in ${s.area}, Dubai — ${fmt(s.companies.length)} Listed & Compared`;
  const description = s.ratedCount
    ? `${fmt(s.companies.length)} licensed interior and fit-out contractors in ${s.area}. ${fmt(s.totalReviews)} Google reviews analysed, average rating ${rating(s.avgRating)}. Free quotes from up to 5 companies.`
    : `${fmt(s.companies.length)} licensed interior and fit-out contractors in ${s.area}, Dubai. Compare and request free quotes.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/areas/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/areas/${slug}` },
    // Thin areas stay crawlable (links still pass) but never compete in the index.
    ...(s.indexable ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadArea(slug);
  if (!data) notFound();
  const { stats: s, peers, rank, areaCount } = data;

  const faqs = [
    {
      q: `How many interior fit-out companies are there in ${s.area}?`,
      a: `We list ${fmt(s.companies.length)} in ${s.area}${rank ? `, which ranks #${rank} of ${areaCount} Dubai areas by company count` : ""}. ${
        s.ratedCount
          ? `${fmt(s.ratedCount)} have a public Google rating, averaging ${rating(s.avgRating)} from ${fmt(s.totalReviews)} reviews.`
          : "Ratings are still being collected for this area."
      }`,
    },
    {
      q: `How much does renovation cost in ${s.area}?`,
      a: `Most ${s.area} apartment renovations land between AED 60,000 and AED 250,000 — roughly AED 150–250 per sqft at a standard finish level. Kitchens and bathrooms drive the biggest swings, and villas run higher per sqft because of external works. Full breakdown in our 2026 cost guide.`,
    },
    {
      q: `Do I need approvals to renovate in ${s.area}?`,
      a: `Almost always. You need an NOC from your building or community management — a refundable deposit of AED 2,000–5,000 is typical — plus Dubai Municipality approval for any structural, electrical or plumbing change. Only a licensed contractor can file the DM permit, which is one reason to check the trade licence before signing.`,
    },
    {
      q: `How do I pick between ${s.area} contractors?`,
      a: `Compare at least three quotes line by line, verify each company's trade licence and DET fit-out activity, and ask who supervises the site day to day. Ratings are a starting filter, not a decision: ${
        s.topRated.length ? `${fmt(s.topRated.length)} companies here sit at ${TOP_RATED_MIN}+, so the rating alone will not narrow it down.` : "review volume matters more than the score itself."
      }`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Interior fit-out companies in ${s.area}, Dubai`,
    numberOfItems: s.companies.length,
    itemListElement: s.companies.slice(0, 25).map((c, i) => ({
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <PageHeader
        title={`Interior Fit-Out Companies in ${s.area}, Dubai`}
        action={<ShareButtons title={`Interior companies in ${s.area}, Dubai`} path={`/areas/${slug}`} compact />}
      />

      <p className="max-w-3xl text-[15px] leading-relaxed text-gray-600">{leadParagraph(s, rank)}</p>

      {s.ratedCount > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Companies listed" value={fmt(s.companies.length)} sub={rank ? `#${rank} of ${areaCount} areas` : undefined} />
          <Stat label="Average Google rating" value={rating(s.avgRating)} sub={`${fmt(s.ratedCount)} rated`} />
          <Stat label="Reviews analysed" value={fmt(s.totalReviews)} sub="Google Maps" />
          <Stat label={`Rated ${TOP_RATED_MIN}+`} value={fmt(s.topRated.length)} sub={`${Math.round((s.topRated.length / Math.max(s.ratedCount, 1)) * 100)}% of rated`} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-cream p-5">
        <p className="text-sm text-gray-500">
          Renovating in {s.area}? Send one brief, get quotes from up to 5 contractors — free.
        </p>
        <Link href="/quote" className="ml-auto rounded-xl bg-terracotta px-6 py-2.5 text-sm font-bold text-cream hover:bg-terracotta-deep">
          Request quotes →
        </Link>
      </div>

      {s.categories.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">What {s.area} companies specialise in</h2>
          <p className="mt-1 text-sm text-gray-500">
            Companies list more than one specialism, so the counts overlap.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-cream">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
                  <th className="px-4 py-2.5 font-semibold">Specialism</th>
                  <th className="px-4 py-2.5 font-semibold">Companies in {s.area}</th>
                  <th className="px-4 py-2.5 font-semibold">Avg Google rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {s.categories.map((c) => (
                  <tr key={c.name}>
                    <td className="px-4 py-2.5 text-gray-700">
                      {c.count >= MIN_INDEXABLE ? (
                        <Link href={`/areas/${slug}/${categorySlug(c.name)}`} className="font-semibold text-charcoal hover:underline">
                          {c.name}
                        </Link>
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-600">{fmt(c.count)}</td>
                    <td className="px-4 py-2.5 font-mono text-gray-600">{rating(c.avgRating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {s.topRated.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">Most-reviewed companies in {s.area}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Rated {TOP_RATED_MIN}+ on Google, ordered by review count — volume is harder to fake than a score.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-cream">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
                  <th className="px-4 py-2.5 font-semibold">Company</th>
                  <th className="px-4 py-2.5 font-semibold">Rating</th>
                  <th className="px-4 py-2.5 font-semibold">Reviews</th>
                  <th className="px-4 py-2.5 font-semibold">Specialisms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {s.topRated.slice(0, 15).map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-2.5">
                      <Link href={`/companies/${c.id}`} className="font-semibold text-charcoal hover:underline">{c.name}</Link>
                      {c.placeId && (
                        <a href={mapsUrl(c.name, c.placeId)} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-gray-400 hover:text-terracotta-deep">Maps ↗</a>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-600">{c.googleRating?.toFixed(1)}</td>
                    <td className="px-4 py-2.5 font-mono text-gray-600">{fmt(c.googleRatingCount ?? 0)}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{c.categories.slice(0, 3).join(" · ") || "Interior"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-gray-400">
            Ratings and review counts are public Google Maps data, refreshed monthly. We do not sell placement in this table.
          </p>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-bold">All {fmt(s.companies.length)} companies in {s.area}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {s.companies.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/companies/${c.id}`} className="truncate font-bold hover:underline">{c.name}</Link>
                  {c.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="gray">Unclaimed</Badge>}
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-400">
                  {c.googleRating ? `★ ${c.googleRating.toFixed(1)} · ${fmt(c.googleRatingCount ?? 0)} reviews · ` : ""}
                  {c.categories.slice(0, 2).join(" · ") || "Interior"}
                </p>
              </div>
              <Link href={`/quote?c=${c.id}`} className="shrink-0 rounded-lg bg-walnut px-4 py-2 text-xs font-bold text-cream hover:bg-walnut-deep">
                Get quote
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold">Renovating in {s.area} — quick answers</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-gray-200 bg-cream p-4">
              <p className="font-semibold">{f.q}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Deeper dives: <Link href="/guides/apartment-renovation-cost-dubai" className="font-semibold text-terracotta-deep hover:underline">2026 cost guide</Link> ·{" "}
          <Link href="/guides/dubai-renovation-permits-dm-approval-noc" className="font-semibold text-terracotta-deep hover:underline">permits &amp; NOC guide</Link> ·{" "}
          <Link href="/guides/verify-contractor-license-dubai" className="font-semibold text-terracotta-deep hover:underline">licence check</Link>
        </p>
      </section>

      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Compare other Dubai areas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {peers.map((a) => (
            <Link key={a.area} href={`/areas/${areaSlug(a.area)}`} className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:border-clay hover:text-charcoal">
              {a.area} <span className="text-gray-400">{fmt(a.companies.length)}</span>
            </Link>
          ))}
          <Link href="/companies" className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-semibold text-terracotta-deep hover:border-clay">
            All 649 companies →
          </Link>
        </div>
      </section>
    </div>
  );
}
