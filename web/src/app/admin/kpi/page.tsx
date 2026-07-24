"use client";

import { useState } from "react";
import { fmt, kpi } from "@/lib/data";
import { Card, PageHeader, Stat } from "@/components/ui";

const periods = ["일", "주", "월", "분기"] as const;

export default function AdminKPI() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("월");
  const cur = kpi.monthly[kpi.monthly.length - 1];
  const prev = kpi.monthly[kpi.monthly.length - 2];
  const maxQuotes = Math.max(...kpi.monthly.map((m) => m.quotes));

  return (
    <div>
      <PageHeader
        title="KPI 통계 대시보드"
        desc="지표 카드를 클릭하면 상세 내역으로 드릴다운합니다."
        action={
          <div className="flex rounded-lg border border-gray-200 bg-white p-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-4 py-1.5 text-xs font-medium ${period === p ? "bg-slate-900 text-white" : "text-gray-500"}`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="월간 등록 업체" value={fmt(cur.companies)} sub={`전월 ${fmt(prev.companies)} → +${cur.companies - prev.companies}`} tone="good" />
        <Stat label="월간 견적 요청" value={fmt(cur.quotes)} sub={`전월 대비 +${Math.round(((cur.quotes - prev.quotes) / prev.quotes) * 100)}%`} tone="good" />
        <Stat label="에스크로 거래" value={`${cur.escrow}건`} sub="2단계 전환 목표: 월 50건" />
        <Stat label="분쟁 발생률" value="3.1%" sub="목표 5% 이하 유지 중" tone="good" />
      </div>

      <Card className="mt-6">
        <h2 className="mb-6 font-bold">견적 요청 추이 (최근 6개월)</h2>
        <div className="flex h-48 items-end gap-3">
          {kpi.monthly.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-bold">{m.quotes}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-slate-900 to-slate-600"
                style={{ height: `${(m.quotes / maxQuotes) * 100}%` }}
              />
              <span className="text-[10px] text-gray-400">{m.month.slice(5)}월</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold">업체 등록 · Claim 전환</h2>
          <div className="space-y-2">
            {kpi.monthly.slice(-4).map((m) => (
              <div key={m.month} className="flex items-center gap-3 text-sm">
                <span className="w-14 text-xs text-gray-400">{m.month.slice(5)}월</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(m.claims / m.companies) * 100 * 3}%` }} />
                </div>
                <span className="w-32 text-right text-xs">
                  {m.companies}개 중 <b>{m.claims}</b> Claim ({Math.round((m.claims / m.companies) * 100)}%)
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">목표: 런칭 6개월 내 등록 500개 · Claim 100개 (현재 476 / 96)</p>
        </Card>
        <Card>
          <h2 className="mb-4 font-bold">수익 구성 (이번 달)</h2>
          <div className="flex items-center gap-4">
            <div className="h-32 w-32 shrink-0 rounded-full" style={{ background: `conic-gradient(#0f172a 0% ${Math.round((kpi.leadRevenue / (kpi.leadRevenue + kpi.packageRevenue)) * 100)}%, #10b981 0% 100%)` }} />
            <div className="space-y-2 text-sm">
              <p><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-slate-900" />리드 수수료 AED {fmt(kpi.leadRevenue)}</p>
              <p><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-emerald-500" />노출 패키지 AED {fmt(kpi.packageRevenue)}</p>
              <p className="border-t border-gray-100 pt-2 font-bold">합계 AED {fmt(kpi.leadRevenue + kpi.packageRevenue)}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
