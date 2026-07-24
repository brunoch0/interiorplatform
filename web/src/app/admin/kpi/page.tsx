"use client";

import { useState } from "react";
import { fmt, kpi } from "@/lib/data";
import { Card, PageHeader, Stat } from "@/components/ui";

const periods = ["Day", "Week", "Month", "Quarter"] as const;

export default function AdminKPI() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("Month");
  const cur = kpi.monthly[kpi.monthly.length - 1];
  const prev = kpi.monthly[kpi.monthly.length - 2];
  const maxQuotes = Math.max(...kpi.monthly.map((m) => m.quotes));

  return (
    <div>
      <PageHeader
        title="KPI Analytics Dashboard"
        desc="Click a metric card to drill down into details."
        action={
          <div className="flex rounded-lg border border-gray-200 bg-white p-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-4 py-1.5 text-xs font-medium ${period === p ? "bg-walnut text-cream" : "text-gray-500"}`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Listed contractors" value={fmt(cur.companies)} sub={`Last month ${fmt(prev.companies)} → +${cur.companies - prev.companies}`} tone="good" />
        <Stat label="Quote requests" value={fmt(cur.quotes)} sub={`+${Math.round(((cur.quotes - prev.quotes) / prev.quotes) * 100)}% vs last month`} tone="good" />
        <Stat label="Escrow transactions" value={`${cur.escrow}`} sub="Phase 2 target: 50/month" />
        <Stat label="Dispute rate" value="3.1%" sub="Kept under 5% target" tone="good" />
      </div>

      <Card className="mt-6">
        <h2 className="mb-6 font-bold">Quote request trend (last 6 months)</h2>
        <div className="flex h-48 items-end gap-3">
          {kpi.monthly.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-bold">{m.quotes}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-slate-900 to-slate-600"
                style={{ height: `${(m.quotes / maxQuotes) * 100}%` }}
              />
              <span className="text-[10px] text-gray-400">{m.month.slice(5)}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold">Listings · Claim conversion</h2>
          <div className="space-y-2">
            {kpi.monthly.slice(-4).map((m) => (
              <div key={m.month} className="flex items-center gap-3 text-sm">
                <span className="w-14 text-xs text-gray-400">{m.month.slice(5)}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-terracotta" style={{ width: `${(m.claims / m.companies) * 100 * 3}%` }} />
                </div>
                <span className="w-40 text-right text-xs">
                  <b>{m.claims}</b> of {m.companies} claimed ({Math.round((m.claims / m.companies) * 100)}%)
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">Target: 500 listings · 100 claims within 6 months of launch (now 476 / 96)</p>
        </Card>
        <Card>
          <h2 className="mb-4 font-bold">Revenue mix (this month)</h2>
          <div className="flex items-center gap-4">
            <div className="h-32 w-32 shrink-0 rounded-full" style={{ background: `conic-gradient(#0f172a 0% ${Math.round((kpi.leadRevenue / (kpi.leadRevenue + kpi.packageRevenue)) * 100)}%, #10b981 0% 100%)` }} />
            <div className="space-y-2 text-sm">
              <p><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-walnut" />Lead fees AED {fmt(kpi.leadRevenue)}</p>
              <p><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-terracotta" />Packages AED {fmt(kpi.packageRevenue)}</p>
              <p className="border-t border-gray-100 pt-2 font-bold">Total AED {fmt(kpi.leadRevenue + kpi.packageRevenue)}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
