"use client";

import { useState } from "react";
import { supplierLeads, type Lead } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

const statusTone: Record<Lead["status"], "blue" | "green" | "red" | "gray"> = {
  신규: "blue", 수락: "green", 거절: "red", 만료: "gray",
};

export default function SupplierLeads() {
  const [leads, setLeads] = useState(supplierLeads);

  const act = (id: string, status: Lead["status"]) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        title="수신 견적 요청 관리"
        desc="리드 수락 시 건당 수수료가 청구됩니다. 거절 또는 24시간 미응답 시 다음 순위 업체에 자동 전달됩니다."
      />
      <Notice tone="amber">
        수수료 미납 시 리드 수신 기능이 일시 정지됩니다. 이번 달 청구 예정: <b>AED 1,450</b> · 정산일 08-01
      </Notice>

      <div className="mt-6 space-y-4">
        {leads.map((l) => (
          <Card key={l.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{l.spaceType} · {l.area}</p>
                  <Badge tone={statusTone[l.status]}>{l.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-400">{l.consumer} · 예산 {l.budget} · 수신 {l.receivedAt}</p>
                <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{l.wish}</p>
              </div>
              <div className="w-40 text-right">
                <p className="text-xs text-gray-400">리드 수수료</p>
                <p className="text-lg font-black">AED {l.fee}</p>
                {l.status === "신규" && (
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => act(l.id, "거절")} className="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-500 hover:border-gray-400">거절</button>
                    <button onClick={() => act(l.id, "수락")} className="flex-1 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white hover:bg-emerald-600">수락</button>
                  </div>
                )}
                {l.status === "수락" && <p className="mt-2 text-xs text-emerald-600">✓ 소비자에게 수락 알림 발송됨<br />7일 내 견적서를 제출하세요</p>}
                {l.status === "거절" && <p className="mt-2 text-xs text-gray-400">다음 순위 업체에 전달됨</p>}
              </div>
            </div>
            {l.status === "수락" && (
              <button className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-700">견적서 작성·제출 →</button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
