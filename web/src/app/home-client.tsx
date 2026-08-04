"use client";

import Link from "next/link";
import { fmt, interiorPhoto, type Company } from "@/lib/data";
import { areaSlug } from "@/lib/site";
import { Badge, Card, MetricValue } from "@/components/ui";
import { tmpl, useI18n } from "@/lib/i18n/provider";

const areasTicker = [
  "Business Bay", "الخليج التجاري", "Dubai Marina", "Palm Jumeirah", "نخلة جميرا",
  "Downtown", "JLT", "Arabian Ranches", "Al Quoz", "القوز", "JVC", "Emirates Hills", "DIFC",
];

type Props = {
  total: number;
  areas: number;
  pipelineAed: number;
  featured: Company[];
  topAreas: [string, number][];
};

export default function HomeClient({ total, areas, pipelineAed, featured, topAreas }: Props) {
  const { dict } = useI18n();
  const t = dict.home;
  const steps = [
    { n: "01", title: t.s1t, body: t.s1b },
    { n: "02", title: t.s2t, body: t.s2b },
    { n: "03", title: t.s3t, body: t.s3b },
  ];

  return (
    <div className="grain">
      {/* Hero — asymmetric editorial split */}
      <section className="overflow-hidden bg-walnut text-cream">
        <div className="mx-auto grid max-w-6xl items-end gap-10 px-4 pt-16 md:grid-cols-[3fr_2fr] md:gap-16">
          <div className="pb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">{t.kicker}</p>
            <h1 className="mt-5 text-4xl leading-[1.08] md:text-[3.4rem]">
              {t.title1}{" "}
              <span className="relative inline-block">
                {t.titleAccent}
                {/* hand-drawn underline */}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 12" fill="none" aria-hidden>
                  <path d="M3 8.5C28 4.5 62 3 117 6.5" stroke="#C06A45" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              {t.titleJoin}<br />
              {t.title2}
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-300">{t.body}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/consult" className="rounded-xl bg-terracotta px-8 py-3.5 text-sm font-bold text-cream transition hover:bg-terracotta-deep">
                {t.ctaConsult}
              </Link>
              <Link href="/companies" className="rounded-xl border border-cream/30 px-6 py-3.5 text-sm font-semibold text-cream transition hover:border-cream/60">
                {t.ctaBrowse}
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              <Link href="/supplier/license" className="underline decoration-terracotta decoration-2 underline-offset-4 hover:text-cream">
                {t.claimLink}
              </Link>
            </p>
            <div className="mt-12 border-t border-cream/15 pt-6">
              <p className="font-mono text-3xl font-bold tracking-tight text-terracotta md:text-4xl">
                AED {fmt(pipelineAed)}
              </p>
              <p className="mt-1.5 text-xs text-slate-400">
                {t.pipelineLine}{" "}
                <span className="font-mono font-semibold text-cream">{fmt(total)}</span> {t.companiesWord} ·{" "}
                <span className="font-mono font-semibold text-cream">{areas}</span> {t.areasWord}
              </p>
            </div>
          </div>

          {/* Arch-masked photo with tilted stamp */}
          <div className="relative hidden md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={interiorPhoto(5, 900)}
              alt="Renovated living room in a Dubai apartment"
              className="arch h-[420px] w-full object-cover"
            />
            <div className="absolute -left-5 bottom-8 -rotate-6 rounded-lg border-2 border-cream/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream/90 backdrop-blur-sm">
              {t.detVerified}
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

      {/* Cost calculator strip */}
      <section className="border-b border-gray-200 bg-cream">
        <Link href="/calculator" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 transition hover:bg-sand">
          <div>
            <p className="font-serif text-lg font-semibold text-walnut">{t.calcTitle}</p>
            <p className="text-xs text-gray-500">{t.calcDesc}</p>
          </div>
          <span className="rounded-xl bg-terracotta px-6 py-2.5 text-sm font-bold text-cream">{t.calcBtn}</span>
        </Link>
      </section>

      {/* How it works — numbered editorial, no icon cards */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">{t.howKicker}</p>
            <h2 className="mt-3 text-3xl leading-snug">{t.howTitle1}<br />{t.howTitle2}</h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">{t.howBody}</p>
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
            <p className="mt-3 text-[11px] text-gray-400">{t.metricsNote} honestly.</p>
          </div>
        </div>
      </section>

      {/* Featured — real photography (EN for now, phase 2) */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-end justify-between border-t border-gray-300 pt-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">From the register</p>
            <h2 className="mt-2 text-2xl">Recently listed contractors</h2>
          </div>
          <Link href="/companies" className="text-sm font-semibold text-terracotta-deep hover:underline">
            {t.allLink} {fmt(total)} →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((c, i) => (
            <Link key={c.id} href={`/companies/${c.id}`}>
              <Card className="h-full p-0 transition hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={interiorPhoto(i * 2, 700)} alt={`${c.name} project`} className="aspect-[4/3] w-full rounded-t-2xl object-cover" />
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-bold">{c.name}</h3>
                    {c.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="gray">Unclaimed</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{c.area} · {c.categories.slice(0, 2).join(" · ")}</p>
                  <div className="mt-4 flex items-baseline gap-5 border-t border-gray-100 pt-4">
                    <div>
                      <p className="font-mono text-lg font-semibold text-emerald-600"><MetricValue value={c.scheduleComplianceRate} suffix="%" /></p>
                      <p className="text-[10px] text-gray-400">on schedule</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-semibold">{fmt(c.verifiedReviewCount)}</p>
                      <p className="text-[10px] text-gray-400">verified reviews</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Founder note — first person, signed (EN for now, phase 2) */}
      <section className="border-y border-gray-200 bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[2fr_3fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
              OnePass Interior lists every licensed fit-out company we can verify, publishes only what documents can prove,
              and holds your money in escrow until an independent inspector says the work passed. That&apos;s it. No stars,
              no sponsored reviews.
            </p>
            <p className="mt-6 font-serif text-lg italic text-walnut">— Bruno, Founder · دار</p>
          </div>
        </div>
      </section>

      {/* Browse by area — internal links for SEO + navigation */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="border-t border-gray-300 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">{t.browseKicker}</p>
          <h2 className="mt-2 text-2xl">{t.browseTitle}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {topAreas.map(([a, n]) => (
              <Link
                key={a}
                href={`/areas/${areaSlug(a)}`}
                className="rounded-full border border-gray-300 bg-cream px-4 py-2 text-sm text-gray-600 transition hover:border-terracotta hover:text-terracotta-deep"
              >
                {a} <span className="ml-1 font-mono text-xs text-gray-400">{n}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contractor CTA — quiet, typographic */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl">{t.contractorTitle}</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              {tmpl(t.contractorBody, { amount: `AED ${fmt(pipelineAed)}` })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/requests" className="rounded-xl border border-gray-300 px-7 py-3.5 text-sm font-semibold text-charcoal transition hover:border-clay">
              {t.seeBriefs}
            </Link>
            <Link href="/supplier/license" className="rounded-xl bg-walnut px-7 py-3.5 text-sm font-bold text-cream transition hover:bg-walnut-deep">
              {t.claimBtn}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
