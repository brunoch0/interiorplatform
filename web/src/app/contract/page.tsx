"use client";

import { useState } from "react";
import Link from "next/link";
import { contract, fmt } from "@/lib/data";
import { Badge, Card, Notice, Steps } from "@/components/ui";

export default function ContractSign() {
  const [signed, setSigned] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Steps items={["견적 비교", "업체 확정", "계약 서명", "에스크로 예치"]} current={2} />

      <Card>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">마일스톤 계약 서명</h1>
          <Badge tone="blue">표준 계약서 v2.1</Badge>
        </div>

        <div className="mt-6 rounded-xl border border-gray-100 p-5 text-sm">
          <p className="font-bold">공사 도급 계약서 (요약)</p>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between"><dt className="text-gray-400">발주자</dt><dd>{contract.consumer}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">수급자</dt><dd>알누르 인테리어 (Al Noor Interiors LLC)</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">총 계약 금액</dt><dd className="font-bold">AED {fmt(contract.totalAmount)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">공사 기간</dt><dd>{contract.startDate} ~ {contract.endDate}</dd></div>
          </dl>
        </div>

        <h2 className="mt-6 mb-3 text-sm font-bold">마일스톤별 대금 비율</h2>
        <div className="space-y-2">
          {contract.milestones.map((m, i) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <span><b className="mr-2 text-gray-400">M{i + 1}</b>{m.name}</span>
              <span className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{m.dueDate}</span>
                <b>{m.ratio}%</b>
                <span className="text-xs text-gray-400">AED {fmt((contract.totalAmount * m.ratio) / 100)}</span>
              </span>
            </div>
          ))}
        </div>

        <Notice tone="amber">
          계약 확정 후 마일스톤 일정 변경은 양측 동의 + 운영자 승인이 필요합니다. 각 마일스톤 대금은 전문 감리 통과 시에만 에스크로에서 송금됩니다.
        </Notice>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className={`rounded-xl border-2 p-4 text-center ${signed ? "border-emerald-400 bg-emerald-50" : "border-dashed border-gray-300"}`}>
            <p className="text-xs text-gray-400">발주자 서명</p>
            {signed ? (
              <p className="mt-2 font-serif text-lg italic text-emerald-700">Kim ✓</p>
            ) : (
              <button onClick={() => setSigned(true)} className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white">
                전자 서명하기
              </button>
            )}
          </div>
          <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4 text-center">
            <p className="text-xs text-gray-400">수급자 서명</p>
            <p className="mt-2 font-serif text-lg italic text-emerald-700">AlNoor ✓</p>
            <p className="text-[10px] text-gray-400">2026-07-24 14:02 서명 완료</p>
          </div>
        </div>

        {signed ? (
          <Link href="/contract/escrow" className="mt-6 block w-full rounded-xl bg-emerald-500 py-4 text-center text-sm font-bold text-white hover:bg-emerald-600">
            서명 완료 — 에스크로 예치로 이동 →
          </Link>
        ) : (
          <p className="mt-6 text-center text-xs text-gray-400">양측 서명 완료 시 계약이 확정되고 PDF 다운로드가 제공됩니다.</p>
        )}
      </Card>
    </div>
  );
}
