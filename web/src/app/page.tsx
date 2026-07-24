import Link from "next/link";
import { companies, fmt } from "@/lib/data";
import { Badge, Card, MetricValue, Placeholder } from "@/components/ui";

export default function Home() {
  const featured = companies.filter((c) => c.verified).slice(0, 3);
  return (
    <div>
      {/* Hero + Search */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold text-emerald-400">DUBAI TRUSTED INTERIOR PLATFORM</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
            Find verified Dubai contractors
            <br />
            by <span className="text-emerald-400">data</span>, not star ratings
          </h1>
          <p className="mt-4 max-w-xl text-slate-300">
            Schedule compliance · extra-charge history · DM approval speed. We publish only quantitative metrics from verified reviews.
          </p>
          <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 sm:flex-row">
            <select className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900">
              <option>Space type: All</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Commercial</option>
            </select>
            <select className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900">
              <option>Area: All</option>
              <option>Business Bay</option>
              <option>Dubai Marina</option>
              <option>Downtown</option>
              <option>Palm Jumeirah</option>
            </select>
            <Link
              href="/companies"
              className="rounded-xl bg-emerald-500 px-8 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              Search
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              ["476", "Listed contractors"],
              ["96", "Verified contractors"],
              ["571", "Quote requests"],
              ["43%", "Verified review rate"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-3xl font-black text-white">{v}</p>
                <p className="mt-1 text-xs text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-xl font-bold">Why DubaiInterior</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            ["📊", "Quantitative metrics only", "Instead of fake reviews, compare schedule compliance, extra-charge rates and approval speed as hard numbers — a design that is safe under UAE defamation law."],
            ["🛡️", "DET license verification", "Only contractors with a verified trade license and DET fit-out license earn the 'Verified' badge. Profiles deactivate automatically on expiry."],
            ["🏗️", "Escrow + professional QA", "Project funds sit in escrow and are released per milestone only after our QA inspectors pass the work — structurally eliminating deposit fraud."],
          ].map(([icon, title, desc]) => (
            <Card key={title}>
              <span className="text-2xl">{icon}</span>
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured companies */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured verified contractors</h2>
          <Link href="/companies" className="text-sm font-semibold text-emerald-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {featured.map((c, i) => (
            <Link key={c.id} href={`/companies/${c.id}`}>
              <Card className="transition hover:shadow-md">
                <Placeholder label={c.legalName} hue={190 + i * 35} />
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="font-bold">{c.name}</h3>
                  <Badge tone="green">Verified</Badge>
                  {c.exposurePackage === "premium" && <Badge tone="amber">Premium</Badge>}
                </div>
                <p className="mt-1 text-xs text-gray-400">{c.area} · {c.priceRange}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-50 pt-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-emerald-600"><MetricValue value={c.scheduleComplianceRate} suffix="%" /></p>
                    <p className="text-[10px] text-gray-400">On schedule</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900"><MetricValue value={c.noExtraChargeRate} suffix="%" /></p>
                    <p className="text-[10px] text-gray-400">No extra charges</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{fmt(c.verifiedReviewCount)}</p>
                    <p className="text-[10px] text-gray-400">Verified reviews</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Supplier CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-gradient-to-r from-sky-600 to-slate-900 p-10 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Are you an interior contractor?</h2>
            <p className="mt-2 text-sm text-sky-100">
              Your company profile may already be listed. Claim it and manage your portfolio for free.
            </p>
          </div>
          <Link href="/supplier/license" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-sky-50">
            Claim your profile →
          </Link>
        </div>
      </section>
    </div>
  );
}
