import Link from "next/link";
import { disputes, fmt, kpi, licenseApplications } from "@/lib/data";
import { Card, PageHeader, Stat } from "@/components/ui";

export default function AdminHome() {
  const cur = kpi.monthly[kpi.monthly.length - 1];
  const pendingLicenses = licenseApplications.filter((l) => l.status === "Under Review").length;
  const openDisputes = disputes.filter((d) => d.status !== "Resolved").length;

  return (
    <div>
      <PageHeader title="Operator Dashboard" desc="As of 2026-07-24 · live aggregation" />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Listed contractors (total)" value={fmt(cur.companies)} sub="96 claimed" tone="good" />
        <Stat label="Quote requests this month" value={fmt(cur.quotes)} sub="+17% vs last month" tone="good" />
        <Stat label="Licenses awaiting review" value={`${pendingLicenses}`} sub="Avg. turnaround 1.4 days" tone={pendingLicenses > 0 ? "bad" : "default"} />
        <Stat label="Open disputes" value={`${openDisputes}`} sub="Dispute rate 3.1%" />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Pending tasks</h2>
          </div>
          <div className="space-y-2 text-sm">
            <Link href="/admin/licenses" className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 hover:bg-amber-100">
              <span>License reviews pending</span><b className="text-amber-700">{pendingLicenses}</b>
            </Link>
            <Link href="/admin/disputes" className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 hover:bg-red-100">
              <span>Dispute cases to review</span><b className="text-red-600">{openDisputes}</b>
            </Link>
            <Link href="/admin/inspections" className="flex items-center justify-between rounded-xl bg-sky-50 px-4 py-3 hover:bg-sky-100">
              <span>Reschedule approvals pending</span><b className="text-sky-700">1</b>
            </Link>
            <Link href="/admin/reviews" className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100">
              <span>Flagged reviews to check</span><b>2</b>
            </Link>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-bold">Revenue this month (Phase 1 model)</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <span>Lead connection fees</span><b>AED {fmt(kpi.leadRevenue)}</b>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <span>Exposure package sales</span><b>AED {fmt(kpi.packageRevenue)}</b>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-walnut px-4 py-3 text-sm text-cream">
              <span>Total</span><b>AED {fmt(kpi.leadRevenue + kpi.packageRevenue)}</b>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">Verified review rate {kpi.reviewRate}% (40% target met) · Escrow contracts: {cur.escrow}</p>
        </Card>
      </div>
    </div>
  );
}
