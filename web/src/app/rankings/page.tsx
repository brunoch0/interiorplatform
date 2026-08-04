import Link from "next/link";
import type { Metadata } from "next";
import { fmt } from "@/lib/data";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL, SITE_NAME, areaSlug, mapsUrl } from "@/lib/site";
import { directoryStats, allAreas, TOP_RATED_MIN } from "@/lib/area-stats";
import ShareButtons from "@/components/share-buttons";
import EmailCapture from "@/components/email-capture";
import { PageHeader, Stat } from "@/components/ui";

export const revalidate = 3600;

const TITLE = "Dubai's Most-Reviewed Interior Fit-Out Companies (2026)";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "We analysed every public Google review across 649 licensed interior and fit-out companies in Dubai. Ranked by review volume, with the method stated in full — no paid placement.",
  alternates: { canonical: `${SITE_URL}/rankings` },
  openGraph: { title: TITLE, url: `${SITE_URL}/rankings` },
};

const rating = (n: number | null) => (n == null ? "—" : n.toFixed(2));

export default async function RankingsPage() {
  const companies = await fetchCompanies();
  const d = directoryStats(companies);
  const areas = allAreas(companies);
  const ranked = d.topRated.slice(0, 50);
  const updated = new Date().toISOString().slice(0, 10);

  // Question/answer shape: these are the queries an answer engine is resolving
  // when it decides whether to cite this page.
  const faqs = [
    {
      q: "Who are the most-reviewed interior fit-out companies in Dubai?",
      a: `Across ${fmt(d.total)} licensed companies we track, the highest review volumes belong to ${ranked
        .slice(0, 3)
        .map((c) => `${c.name} (${fmt(c.googleRatingCount ?? 0)} reviews, ${c.googleRating?.toFixed(1)})`)
        .join(", ")}. Review volume is a better signal than score alone because ${fmt(d.topRated.length)} of ${fmt(d.ratedCount)} rated companies already sit at ${TOP_RATED_MIN} or above — the score does not separate them.`,
    },
    {
      q: "How many interior fit-out companies are there in Dubai?",
      a: `${fmt(d.total)} licensed interior and fit-out companies are listed here across ${d.areaCount} areas. ${fmt(d.ratedCount)} carry a public Google rating, averaging ${rating(d.avgRating)} from ${fmt(d.totalReviews)} reviews in total.`,
    },
    {
      q: "Which Dubai area has the most fit-out companies?",
      a: `${areas[0]?.area} — ${fmt(areas[0]?.companies.length ?? 0)} companies, well ahead of ${areas[1]?.area} (${fmt(areas[1]?.companies.length ?? 0)}) and ${areas[2]?.area} (${fmt(areas[2]?.companies.length ?? 0)}). Industrial and warehouse districts concentrate joinery and fit-out workshops, which is why they outrank residential communities on company count.`,
    },
    {
      q: "Is this ranking paid or sponsored?",
      a: `No. Placement cannot be bought. The order is review count from public Google Maps data, applied identically to every company, and companies that have claimed their profile get no ranking advantage.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: TITLE,
    description: `Interior fit-out companies in Dubai ranked by public Google review volume, from ${fmt(d.totalReviews)} reviews across ${fmt(d.total)} companies.`,
    numberOfItems: ranked.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: ranked.map((c, i) => ({
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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <PageHeader
        title={TITLE}
        action={<ShareButtons title={TITLE} path="/rankings" compact />}
      />

      <p className="max-w-3xl text-[15px] leading-relaxed text-gray-600">
        {SITE_NAME} tracks {fmt(d.total)} licensed interior and fit-out companies across {d.areaCount} Dubai areas.
        {" "}{fmt(d.ratedCount)} of them carry a public Google rating, averaging {rating(d.avgRating)} from{" "}
        {fmt(d.totalReviews)} reviews. Because {Math.round((d.topRated.length / Math.max(d.ratedCount, 1)) * 100)}% of
        rated companies already sit at {TOP_RATED_MIN} or above, a star score alone tells you almost nothing — so this
        table ranks by how many people actually reviewed them.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Companies tracked" value={fmt(d.total)} sub={`${d.areaCount} areas`} />
        <Stat label="Reviews analysed" value={fmt(d.totalReviews)} sub="public Google Maps" />
        <Stat label="Average rating" value={rating(d.avgRating)} sub={`${fmt(d.ratedCount)} rated`} />
        <Stat label={`Rated ${TOP_RATED_MIN}+`} value={fmt(d.topRated.length)} sub="why score alone fails" />
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Top 50 by review volume</h2>
        <p className="mt-1 text-sm text-gray-500">
          Public Google Maps data, refreshed monthly. Last updated {updated}.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-cream">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
                <th className="px-4 py-2.5 font-semibold">#</th>
                <th className="px-4 py-2.5 font-semibold">Company</th>
                <th className="px-4 py-2.5 font-semibold">Area</th>
                <th className="px-4 py-2.5 font-semibold">Rating</th>
                <th className="px-4 py-2.5 font-semibold">Reviews</th>
                <th className="px-4 py-2.5 font-semibold">Specialisms</th>
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
                  <td className="px-4 py-2.5 text-xs text-gray-500">
                    {c.area === "Dubai" ? "Dubai" : (
                      <Link href={`/areas/${areaSlug(c.area)}`} className="hover:underline">{c.area}</Link>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-600">{c.googleRating?.toFixed(1)}</td>
                  <td className="px-4 py-2.5 font-mono text-gray-600">{fmt(c.googleRatingCount ?? 0)}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">{c.categories.slice(0, 2).join(" · ") || "Interior"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Where Dubai's fit-out companies are based</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-cream">
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
              {areas.map((a) => (
                <tr key={a.area}>
                  <td className="px-4 py-2.5">
                    {a.indexable ? (
                      <Link href={`/areas/${areaSlug(a.area)}`} className="font-semibold text-charcoal hover:underline">{a.area}</Link>
                    ) : (
                      <span className="text-gray-600">{a.area}</span>
                    )}
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
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">What Dubai fit-out companies specialise in</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-cream">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
                <th className="px-4 py-2.5 font-semibold">Specialism</th>
                <th className="px-4 py-2.5 font-semibold">Companies</th>
                <th className="px-4 py-2.5 font-semibold">Avg Google rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {d.categories.filter((c) => c.count >= 3).map((c) => (
                <tr key={c.name}>
                  <td className="px-4 py-2.5 text-gray-700">{c.name}</td>
                  <td className="px-4 py-2.5 font-mono text-gray-600">{fmt(c.count)}</td>
                  <td className="px-4 py-2.5 font-mono text-gray-600">{rating(c.avgRating)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-gray-200 bg-cream p-6">
        <h2 className="text-xl font-bold">Method</h2>
        <ul className="mt-3 space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
          <li className="list-disc">
            <strong>Source.</strong> Ratings and review counts are public Google Maps data for each company&apos;s
            registered listing, refreshed monthly. We do not collect, host or edit the reviews themselves.
          </li>
          <li className="list-disc">
            <strong>Inclusion.</strong> Every company in our directory that has a public listing is eligible. Nothing is
            excluded for declining to pay, and nothing is added for paying.
          </li>
          <li className="list-disc">
            <strong>Order.</strong> Review count, descending. We rank by volume rather than score because{" "}
            {Math.round((d.topRated.length / Math.max(d.ratedCount, 1)) * 100)}% of rated companies sit at {TOP_RATED_MIN}+,
            so the score does not discriminate — and a small number of reviews is easy to influence.
          </li>
          <li className="list-disc">
            <strong>What this is not.</strong> Not a quality audit. A high review count means many customers, not a good
            contract. Use it to build a shortlist, then check the trade licence and compare quotes line by line.
          </li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          Related: <Link href="/guides/verify-contractor-license-dubai" className="font-semibold text-terracotta-deep hover:underline">how to verify a licence</Link> ·{" "}
          <Link href="/guides/compare-renovation-quotes-dubai" className="font-semibold text-terracotta-deep hover:underline">comparing quotes</Link> ·{" "}
          <Link href="/guides/renovation-contract-checklist-dubai" className="font-semibold text-terracotta-deep hover:underline">contract checklist</Link>
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Questions this page answers</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-gray-200 bg-cream p-4">
              <p className="font-semibold">{f.q}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <EmailCapture source="rankings" />
      </div>
    </div>
  );
}
