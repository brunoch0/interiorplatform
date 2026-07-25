import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, HandCoins, ScrollText, ShieldCheck } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import { Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "How You're Protected — Renovation Consumer Protection in Dubai",
  description:
    "Dubai Interior's protection framework: standard contract terms, milestone documentation, mediation with real consequences for contractors, and DET escalation support.",
  alternates: { canonical: `${SITE_URL}/protection` },
};

const CONTRACT_TERMS = [
  ["Scope annex", "Every quote itemised in writing — what's included, brand and grade of materials. No scope ambiguity to exploit later."],
  ["Staged payments", "Never more than 20–30% upfront. Each payment tied to a completed, photographed milestone."],
  ["Written variation orders", "No extra charge is payable unless agreed in writing before the work is done. Verbal extras don't count."],
  ["Delay clause", "Agreed programme with a daily delay deduction (capped), so time overruns cost the contractor, not you."],
  ["Retention", "5–10% of the contract held back until every snag on the handover list is fixed."],
  ["12-month warranty", "Defects liability period after handover, in writing."],
];

const LADDER = [
  { step: "1", title: "Platform mediation", body: "Report the issue and we contact the contractor within one business day, pushing for a fix within 48 hours. Most issues end here — listed contractors have future leads at stake." },
  { step: "2", title: "It goes on the record", body: "Unresolved issues suspend verification badges, remove ranking priority, and feed the contractor's public performance metrics — schedule compliance and extra-charge rates are facts, not opinions." },
  { step: "3", title: "Official escalation, prepared", body: "If it still isn't fixed, we help you assemble the evidence pack — contract, payments, photos, timeline — and walk you through filing with Dubai Consumer (DET, 600 545 555) or, for fraud, Dubai Police." },
];

export default function ProtectionPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        title="How you're protected"
        desc="Renovation is a one-time purchase, so some contractors bet you can't hold them accountable. Our job is to change that math — with paperwork, records, and consequences."
      />

      {/* Escalation ladder */}
      <div className="grid gap-4 md:grid-cols-3">
        {LADDER.map((l) => (
          <Card key={l.step}>
            <p className="font-mono text-2xl font-bold text-terracotta">{l.step}</p>
            <p className="mt-1 font-bold">{l.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{l.body}</p>
          </Card>
        ))}
      </div>

      {/* Standard contract */}
      <Card className="mt-8">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-terracotta-deep" strokeWidth={1.75} />
          <h2 className="text-lg font-bold">The standard contract, free with every match</h2>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
          Every project matched through Dubai Interior comes with our standard contract template. A contractor who
          refuses these terms is telling you something — that refusal is itself a screening tool.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {CONTRACT_TERMS.map(([term, desc]) => (
            <div key={term} className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-bold">{term}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Why contractors behave */}
      <Card className="mt-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-terracotta-deep" strokeWidth={1.75} />
          <h2 className="text-lg font-bold">Why listed contractors stay on their toes</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
          <div className="flex gap-3">
            <HandCoins className="h-5 w-5 shrink-0 text-clay" strokeWidth={1.75} />
            <p className="text-gray-500"><b className="text-charcoal">Future leads at stake.</b> One botched project cuts a contractor off from the demand flowing through the platform.</p>
          </div>
          <div className="flex gap-3">
            <FileCheck2 className="h-5 w-5 shrink-0 text-clay" strokeWidth={1.75} />
            <p className="text-gray-500"><b className="text-charcoal">Everything is documented.</b> Milestones, payments and change orders leave a paper trail that stands up in a DET complaint.</p>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-clay" strokeWidth={1.75} />
            <p className="text-gray-500"><b className="text-charcoal">Metrics are public.</b> Delays and extra charges show on their profile as verified facts — permanently.</p>
          </div>
        </div>
      </Card>

      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-walnut p-8 text-center text-cream">
        <p className="font-serif text-2xl">Having a problem right now?</p>
        <p className="max-w-md text-sm text-slate-300">
          Report it — we mediate within one business day, and we'll help you escalate if the contractor doesn't fix it.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link href="/report" className="rounded-xl bg-terracotta px-7 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep">
            Report an issue
          </Link>
          <Link href="/guides/renovation-complaints-dubai" className="rounded-xl border border-cream/30 px-7 py-3 text-sm font-semibold text-cream hover:border-cream/60">
            Know your rights →
          </Link>
        </div>
      </div>
    </div>
  );
}
