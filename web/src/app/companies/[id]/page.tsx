import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fmt, getCompany, reviews } from "@/lib/data";
import { fetchCompanyById } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import ShareButtons from "@/components/share-buttons";
import { Badge, BackLink, Card, MetricValue, Notice, Placeholder } from "@/components/ui";

async function loadCompany(id: string) {
  // Real directory rows use UUIDs; legacy demo ids (c1…) fall back to mock data
  return /^[0-9a-f-]{36}$/.test(id) ? await fetchCompanyById(id) : (getCompany(id) ?? null);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = await loadCompany(id);
  if (!c) return {};
  const title = `${c.name} — Interior Contractor in ${c.area}, Dubai`;
  const description = `${c.name} (${c.area}, Dubai) on Dubai Interior: ${c.categories.slice(0, 3).join(", ") || "interior fit-out"}. ${
    c.verified ? "DET-verified contractor with quantitative trust metrics." : "Listed from the public register — request quotes or claim this profile."
  }`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/companies/${id}` },
    openGraph: { title, description, url: `${SITE_URL}/companies/${id}` },
  };
}

export default async function CompanyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await loadCompany(id);
  if (!c) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: c.name,
    url: `${SITE_URL}/companies/${id}`,
    address: { "@type": "PostalAddress", addressLocality: c.area, addressRegion: "Dubai", addressCountry: "AE" },
    areaServed: "Dubai",
    knowsAbout: c.categories,
  };
  const companyReviews = reviews.filter((r) => r.companyId === c.id);

  const metrics = [
    { label: "Schedule compliance", value: c.scheduleComplianceRate, suffix: "%", tip: "Share of projects completed within ±3 days of the agreed schedule, based on verified reviews" },
    { label: "No extra charges", value: c.noExtraChargeRate, suffix: "%", tip: "Share of projects with no charges beyond the contract (agreed change orders excluded)" },
    { label: "Verified reviews", value: c.verifiedReviewCount, suffix: "", tip: "Reviews verified with a completion certificate or final payment receipt" },
    { label: "Avg. approval time", value: c.avgApprovalWeeks, suffix: " wks", tip: "Average weeks from government approval submission (DM etc.) to completion" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BackLink href="/companies" label="Back to contractors" />

      {/* Header */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="w-24 shrink-0">
              <Placeholder label="" ratio="aspect-square" hue={200} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{c.name}</h1>
                {c.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="gray">Unclaimed</Badge>}
                {c.exposurePackage === "premium" && <Badge tone="amber">Premium</Badge>}
              </div>
              <p className="mt-1 text-sm text-gray-400">{c.legalName} · {c.area} · Typical budget {c.priceRange}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.categories.map((cat) => (
                  <Badge key={cat} tone="blue">{cat}</Badge>
                ))}
              </div>
              {c.verified && (
                <p className="mt-2 text-xs text-gray-400">DET license valid until {c.licenseExpiry} · verified automatically by the platform</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-2">
            <Link href={`/quote?c=${id}`} className="rounded-xl bg-terracotta px-8 py-3 text-center text-sm font-bold text-cream hover:bg-terracotta-deep">
              Request a quote — free
            </Link>
            {!c.verified && (
              <Link href="/supplier/license" className="rounded-xl border border-gray-300 px-8 py-2.5 text-center text-xs font-semibold text-gray-500 hover:border-clay">
                Own this business? Claim it →
              </Link>
            )}
          </div>
        </div>
        <div className="mt-5 border-t border-gray-100 pt-4">
          <ShareButtons title={c.name} path={`/companies/${id}`} />
        </div>
      </Card>

      {/* Quantitative trust metrics */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Quantitative trust metrics</h2>
          <span className="text-xs text-gray-400">Auto-computed from verified reviews · cannot be edited by the contractor</span>
        </div>
        {c.verifiedReviewCount < 3 ? (
          <Notice tone="amber">
            Fewer than 3 verified reviews — status: <b>Insufficient data</b>. Metric values are published once 3+ verified reviews exist.
          </Notice>
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="group relative rounded-xl bg-gray-50 p-5 text-center">
                <p className="text-3xl font-black text-slate-900">
                  <MetricValue value={m.value} suffix={m.suffix} />
                </p>
                <p className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-500">
                  {m.label}
                  <span className="cursor-help rounded-full bg-gray-200 px-1.5 text-[10px] text-gray-500" title={m.tip}>?</span>
                </p>
                <div className="pointer-events-none absolute inset-x-2 -bottom-2 z-10 translate-y-full rounded-lg bg-walnut p-3 text-left text-[11px] leading-relaxed text-cream opacity-0 shadow-lg transition group-hover:opacity-100">
                  {m.tip}
                  <p className="mt-1 text-[10px] text-slate-400">※ Metrics are factual data and do not constitute a legal assessment.</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Portfolio */}
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">Portfolio · Completed projects</h2>
              <span className="text-xs text-gray-400">{c.portfolioCount} items</span>
            </div>
            {c.verified ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Placeholder label={i % 2 === 0 ? "BEFORE" : "AFTER"} hue={180 + i * 20} />
                    <p className="mt-1.5 text-xs text-gray-500">{["Business Bay 2BR", "Villa kitchen remodel", "Marina office"][i % 3]}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Notice>Unclaimed profiles show basic information only. The portfolio becomes public after ownership verification.</Notice>
            )}
          </Card>

          {/* Reviews */}
          <Card className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">Verified reviews</h2>
              <span className="text-xs text-gray-400">Only reviews verified with completion documents are published</span>
            </div>
            {companyReviews.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">No verified reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {companyReviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <Badge tone="green">✓ Verified</Badge>
                      <span>{r.author}</span>·<span>{r.spaceType}</span>·<span>{r.date}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className={`font-bold ${r.scheduleDelayDays === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                          {r.scheduleDelayDays === 0 ? "On schedule" : `+${r.scheduleDelayDays} days late`}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center"><p className="font-bold">Approval {r.approvalWeeks} wks</p></div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className={`font-bold ${r.extraCharge ? "text-amber-600" : "text-emerald-600"}`}>Extra charges: {r.extraCharge ? "Yes" : "No"}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center"><p className="font-bold">Quality: {r.qualityOk ? "Good" : "Issues"}</p></div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{r.factNote}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-bold">At a glance</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-400">Area</dt><dd>{c.area}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Space types</dt><dd>{c.spaceTypes.join(", ")}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Typical budget</dt><dd>{c.priceRange}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Verified reviews</dt><dd>{fmt(c.verifiedReviewCount)}</dd></div>
            </dl>
            <p className="mt-4 border-t border-gray-50 pt-4 text-sm leading-relaxed text-gray-500">{c.intro}</p>
          </Card>
          <Card>
            <h3 className="font-bold">Safe transaction guide</h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-gray-500">
              <li>✓ We recommend using the platform&apos;s standard contract before signing</li>
              <li>✓ With escrow, funds are released per milestone only after QA inspection passes</li>
              <li>✓ Dispute mediation support is limited for off-platform transactions</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
