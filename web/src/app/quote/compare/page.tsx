import DemoBanner from "@/components/demo-banner";
import Link from "next/link";
import { fmt, getCompany, quoteRequests } from "@/lib/data";
import { Badge, Card, PageHeader } from "@/components/ui";

export default function QuoteCompare() {
  const received = quoteRequests.filter((q) => q.status === "Received");
  const pending = quoteRequests.filter((q) => q.status !== "Received");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <DemoBanner />
      <PageHeader title="Compare Quotes" desc="Sent 2026-07-18 · 3BR Apartment · Business Bay · 3 received / 1 pending" />

      <div className="grid gap-5 md:grid-cols-3">
        {received.map((q) => {
          const c = getCompany(q.companyId)!;
          const lowest = Math.min(...received.map((r) => r.amount!));
          return (
            <Card key={q.id} className={q.amount === lowest ? "ring-2 ring-terracotta" : ""}>
              <div className="flex items-center justify-between">
                <h2 className="font-bold">{c.name}</h2>
                {q.amount === lowest && <Badge tone="green">Lowest</Badge>}
              </div>
              <p className="mt-0.5 text-xs text-gray-400">{c.area}</p>
              <p className="mt-4 text-3xl font-black">
                <span className="text-base font-semibold text-gray-400">AED </span>
                {fmt(q.amount!)}
              </p>
              <dl className="mt-4 space-y-2 border-t border-gray-50 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-gray-400">Est. duration</dt><dd className="font-semibold">{q.durationWeeks} weeks</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">Schedule compliance</dt><dd className="font-semibold text-emerald-600">{c.scheduleComplianceRate}%</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">No extra charges</dt><dd className="font-semibold">{c.noExtraChargeRate}%</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">Verified reviews</dt><dd className="font-semibold">{c.verifiedReviewCount}</dd></div>
              </dl>
              <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">{q.note}</p>
              <Link
                href={`/quote/confirm?c=${c.id}`}
                className="mt-4 block w-full rounded-xl bg-walnut py-3 text-center text-sm font-bold text-cream hover:bg-walnut-deep"
              >
                Choose this contractor
              </Link>
            </Card>
          );
        })}
      </div>

      {pending.length > 0 && (
        <Card className="mt-6">
          <h3 className="text-sm font-bold text-gray-500">Awaiting response</h3>
          {pending.map((q) => {
            const c = getCompany(q.companyId)!;
            return (
              <div key={q.id} className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
                <span>{c.name}</span>
                <span className="text-xs text-gray-400">Deadline: 2026-07-25 (1 day left)</span>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
