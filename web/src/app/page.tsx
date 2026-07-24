import Link from "next/link";
import { companies, fmt, interiorPhoto } from "@/lib/data";
import { Badge, Card, MetricValue } from "@/components/ui";

const areasTicker = [
  "Business Bay", "الخليج التجاري", "Dubai Marina", "Palm Jumeirah", "نخلة جميرا",
  "Downtown", "JLT", "Arabian Ranches", "Al Quoz", "القوز", "JVC", "Emirates Hills", "DIFC",
];

const steps = [
  {
    n: "01",
    title: "Compare by evidence, not stars",
    body: "Every verified contractor carries three numbers: schedule compliance, no-extra-charge rate, and government approval speed — computed from document-verified reviews. If there isn't enough data, we say so.",
  },
  {
    n: "02",
    title: "Contract with escrow",
    body: "Your budget sits in an escrow account, split across milestones. The contractor sees the deposit; you keep the leverage. Nobody works on trust alone — that's the point.",
  },
  {
    n: "03",
    title: "Release payment only after inspection",
    body: "Our QA inspector walks the site at every milestone — tile levels, waterproofing, caulking. A passing report triggers the payment. A failing one holds it until rework is done.",
  },
];

export default function Home() {
  const featured = companies.filter((c) => c.verified).slice(0, 3);
  return (
    <div className="grain">
      {/* Hero — asymmetric editorial split */}
      <section className="overflow-hidden bg-walnut text-cream">
        <div className="mx-auto grid max-w-6xl items-end gap-10 px-4 pt-16 md:grid-cols-[3fr_2fr] md:gap-16">
          <div className="pb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
              Dubai · دبي — trusted interior marketplace
            </p>
            <h1 className="mt-5 text-4xl leading-[1.08] md:text-[3.4rem]">
              Find contractors by{" "}
              <span className="relative inline-block">
                data
                {/* hand-drawn underline */}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 12" fill="none" aria-hidden>
                  <path d="M3 8.5C28 4.5 62 3 117 6.5" stroke="#C06A45" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              ,<br />
              not star ratings.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-300">
              1,500+ fit-out companies operate in Dubai. We list the ones whose DET licenses check out — and publish
              how they actually performed: on schedule, on budget, approved on time.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/companies"
                className="rounded-xl bg-terracotta px-8 py-3.5 text-sm font-bold text-cream transition hover:bg-terracotta-deep"
              >
                Browse verified contractors
              </Link>
              <Link href="/supplier/license" className="text-sm text-slate-300 underline decoration-terracotta decoration-2 underline-offset-4 hover:text-cream">
                I&apos;m a contractor — claim my profile
              </Link>
            </div>
            <p className="mt-12 text-xs text-slate-400">
              <span className="font-mono text-base font-semibold text-cream">483</span> listed ·{" "}
              <span className="font-mono text-base font-semibold text-cream">97</span> verified ·{" "}
              <span className="font-mono text-base font-semibold text-cream">571</span> quote requests
              <span className="ml-2 text-slate-400">— updated Thursday 14:02</span>
            </p>
          </div>

          {/* Arch-masked photo with tilted stamp */}
          <div className="relative hidden md:block">
            <img
              src={interiorPhoto(5, 900)}
              alt="Renovated living room in a Dubai apartment"
              className="arch h-[420px] w-full object-cover"
            />
            <div className="absolute -left-5 bottom-8 -rotate-6 rounded-lg border-2 border-cream/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream/90 backdrop-blur-sm">
              DET Verified ✓
            </div>
          </div>
        </div>
      </section>

      {/* Area ticker */}
      <div className="overflow-hidden border-b border-gray-200 bg-cream py-3">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap text-xs tracking-wide text-gray-400">
          {[...areasTicker, ...areasTicker].map((a, i) => (
            <span key={i}>{a} <span className="ml-9 text-terracotta">·</span></span>
          ))}
        </div>
      </div>

      {/* How it works — numbered editorial, no icon cards */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">How it works</p>
            <h2 className="mt-3 text-3xl leading-snug">Trust, made<br />inspectable.</h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
              Fake reviews are easy. Faking a schedule-compliance rate computed from completion certificates is not.
            </p>
          </div>
          <div>
            {steps.map((s) => (
              <div key={s.n} className="grid grid-cols-[64px_1fr] gap-6 border-t border-gray-300 py-7 last:border-b">
                <span className="font-serif text-2xl text-terracotta">{s.n}</span>
                <div>
                  <h3 className="font-bold">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">{s.body}</p>
                </div>
              </div>
            ))}
            <p className="mt-3 text-[11px] text-gray-400">
              * Metrics based on 214 verified site inspections since March 2026. Contractors with fewer than 3 verified
              reviews show &ldquo;insufficient data&rdquo; — honestly.
            </p>
          </div>
        </div>
      </section>

      {/* Featured — real photography */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-end justify-between border-t border-gray-300 pt-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">This week</p>
            <h2 className="mt-2 text-2xl">Contractors worth your shortlist</h2>
          </div>
          <Link href="/companies" className="text-sm font-semibold text-terracotta-deep hover:underline">
            All 483 →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((c, i) => (
            <Link key={c.id} href={`/companies/${c.id}`}>
              <Card className="h-full p-0 transition hover:shadow-md">
                <img src={interiorPhoto(i * 2, 700)} alt={`${c.name} project`} className="aspect-[4/3] w-full rounded-t-2xl object-cover" />
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{c.name}</h3>
                    <Badge tone="green">Verified</Badge>
                    {c.exposurePackage === "premium" && <Badge tone="amber">Ad</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{c.area} · {c.priceRange}</p>
                  <div className="mt-4 flex items-baseline gap-5 border-t border-gray-100 pt-4">
                    <div>
                      <p className="font-mono text-lg font-semibold text-emerald-600"><MetricValue value={c.scheduleComplianceRate} suffix="%" /></p>
                      <p className="text-[10px] text-gray-400">on schedule</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-semibold"><MetricValue value={c.noExtraChargeRate} suffix="%" /></p>
                      <p className="text-[10px] text-gray-400">no extra charges</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-semibold">{fmt(c.verifiedReviewCount)}</p>
                      <p className="text-[10px] text-gray-400">reviews</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Founder note — first person, signed */}
      <section className="border-y border-gray-200 bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[2fr_3fr]">
          <div>
            <img src={interiorPhoto(8, 700)} alt="Apartment renovation in progress" className="arch aspect-[4/5] w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">Why we built this</p>
            <blockquote className="mt-5 font-serif text-2xl leading-relaxed text-charcoal md:text-[1.7rem]">
              &ldquo;The quote said AED 120,000. The final bill said AED 163,000, and the tiles weren&apos;t the ones in the
              contract. Nobody I could find in Dubai had a way to check a contractor&apos;s actual track record — so we
              started keeping one.&rdquo;
            </blockquote>
            <p className="mt-6 text-sm leading-relaxed text-gray-500">
              Dubai Interior lists every licensed fit-out company we can verify, publishes only what documents can prove,
              and holds your money in escrow until an independent inspector says the work passed. That&apos;s it. No stars,
              no sponsored reviews.
            </p>
            <p className="mt-6 font-serif text-lg italic text-walnut">— Bruno, Founder · دار</p>
          </div>
        </div>
      </section>

      {/* Contractor CTA — quiet, typographic */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl">Run a fit-out company?</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              Your profile may already be listed from the public DED register. Claiming it is free — you&apos;ll need your
              trade license and DET fit-out license, nothing else.
            </p>
          </div>
          <Link href="/supplier/license" className="rounded-xl bg-walnut px-7 py-3.5 text-sm font-bold text-cream transition hover:bg-walnut-deep">
            Claim your profile →
          </Link>
        </div>
      </section>
    </div>
  );
}
