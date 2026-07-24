"use client";

import { useState } from "react";
import { disputes as seed, fmt, type Dispute } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>(seed);
  const [amount, setAmount] = useState("");

  const resolve = (id: string, resolution: string) =>
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: "중재완료", resolution } : d)));

  return (
    <div>
      <PageHeader title="분쟁 중재 대시보드" desc="분쟁 신청 시 해당 마일스톤 대금은 자동 보류 상태입니다. 중재 결정은 양측에 동시 알림으로 전달됩니다." />

      <div className="space-y-5">
        {disputes.map((d) => (
          <Card key={d.id} className={d.status !== "중재완료" ? "ring-1 ring-red-200" : ""}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold">{d.id.toUpperCase()} · {d.milestone}</p>
              <Badge tone={d.status === "중재완료" ? "green" : "red"}>{d.status}</Badge>
              <Badge tone="gray">신청인: {d.claimant}</Badge>
              <span className="ml-auto text-xs text-gray-400">접수 {d.filedAt}</span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="text-xs text-gray-400">당사자</p>
                <p className="mt-1">{d.consumer} ↔ {d.companyName}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="text-xs text-gray-400">보류 중 대금</p>
                <p className="mt-1 font-bold text-red-600">AED {fmt(d.amount)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="text-xs text-gray-400">증빙 자료</p>
                <p className="mt-1">{d.evidenceCount}건 <button className="ml-1 text-xs text-sky-600 underline">전체 보기</button></p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600"><b className="text-gray-400">신청 사유:</b> {d.reason}</p>

            {d.status === "중재완료" ? (
              <Notice tone="green">중재 결정: {d.resolution} — 양측에 알림 발송 완료. 결정 과정과 결과는 기록·보관됩니다.</Notice>
            ) : (
              <div className="mt-4 rounded-xl border border-gray-100 p-4">
                <p className="text-sm font-bold">중재 결정</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button onClick={() => resolve(d.id, "보류 해제 — 업체 전액 지급")} className="rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600">
                    보류 해제 (업체 지급)
                  </button>
                  <button onClick={() => resolve(d.id, "소비자 전액 환불")} className="rounded-lg bg-red-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-600">
                    환불 (소비자)
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="부분 정산 금액 (AED)"
                      className="w-40 rounded-lg border border-gray-200 px-3 py-2.5 text-xs"
                    />
                    <button
                      onClick={() => resolve(d.id, `부분 정산 — 업체 AED ${amount || "0"} 지급, 잔액 환불`)}
                      className="rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700"
                    >
                      부분 정산 실행
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-400">동일 계약 내 다른 마일스톤 대금 지급은 본 분쟁의 영향을 받지 않습니다.</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
