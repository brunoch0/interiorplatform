import Link from "next/link";
import { BarChart3, ShieldCheck, HardHat } from "lucide-react";
import { companies, fmt } from "@/lib/data";
import { Badge, Card, MetricValue, Placeholder } from "@/components/ui";

const pillars = [
  { Icon: BarChart3, title: "Quantitative metrics only", desc: "Instead of fake reviews, compare schedule compliance, extra-charge rates and approval speed as hard numbers — a design that is safe under UAE defamation law." },
  { Icon: ShieldCheck, title: "DET license verification", desc: "Only contractors with a verified trade license and DET fit-out license earn the 'Verified' badge. Profiles deactivate automatically on expiry." },
  { Icon: HardHat, title: "Escrow + professional QA", desc: "Project funds sit in escrow and are released per milestone only after our QA inspectors pass the work — structurally eliminating deposit fraud." },
];

export default function Home() {
  const featured = companies.filter((c) => c.verified).slice(0, 3);
  return (
    <div>
      {/* Hero + Search */}
      <section className="bg-walnut py-20 text-cream">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold text-terracotta">DUBAI TRUSTED INTERIOR PLATFORM</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
            Find verified Dubai contractors
            <br />
            by <span className="text-terracotta">data</span>, not star ratings
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
              className="rounded-xl bg-terracotta px-8 py-3 text-center text-sm font-bold text-cream transition hover:bg-terracotta-deep"
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
                <p className="text-3xl font-black text-cream">{v}</p>
                <p className="mt-1 text-xs text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-xl font-bold">Why Dubai Interior</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {pillars.map(({ Icon, title, desc }) => (
            <Card key={title}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta-tint">
                <Icon className="h-5 w-5 text-terracotta-deep" strokeWidth={1.75} />
              </span>
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
          <Link href="/companies" className="text-sm font-semibold text-terracotta-deep hover:underline">
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
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-walnut p-10 text-cream md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Are you an interior contractor?</h2>
            <p className="mt-2 text-sm text-slate-300">
              Your company profile may already be listed. Claim it and manage your portfolio for free.
            </p>
          </div>
          <Link href="/supplier/license" className="rounded-xl bg-terracotta px-6 py-3 text-sm font-bold text-cream transition hover:bg-terracotta-deep">
            Claim your profile →
          </Link>
        </div>
      </section>
    </div>
  );
}
