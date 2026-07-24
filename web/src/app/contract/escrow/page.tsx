"use client";

import { useState } from "react";
import Link from "next/link";
import { contract, fmt } from "@/lib/data";
import { Card, Notice, Steps } from "@/components/ui";

export default function EscrowDeposit() {
  const [deposited, setDeposited] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Steps items={["견적 비교", "업체 확정", "계약 서명", "에스크로 예치"]} current={3} />

      <Card>
        <h1 className="text-xl font-bold">에스크로 대금 예치</h1>
        <p className="mt-1 text-sm text-gray-500">
          공사 대금 전액을 플랫폼 에스크로 계좌에 예치합니다. 예치 완료 시 공사 시작 승인이 활성화됩니다.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-xs text-slate-400">예치 금액 (계약 총액)</p>
          <p className="mt-1 text-4xl font-black">AED {fmt(contract.totalAmount)}</p>
          <div className="mt-4 flex items-center justify-between border-t border-slate-700 pt-4 text-xs text-slate-300">
            <span>에스크로 계좌: DIP-ESCROW-****4821</span>
            <span>CBUAE 규정 준수 구조</span>
          </div>
        </div>

        <h2 className="mt-6 mb-3 text-sm font-bold">결제 수단</h2>
        <div className="space-y-2">
          {[
            ["UAE 현지 은행 이체", "수수료 없음 · 1영업일 내 확인", true],
            ["신용카드 (Visa/Master)", "수수료 2.5% · 즉시 확인", false],
          ].map(([label, desc, def]) => (
            <label key={label as string} className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-50">
              <span className="flex items-center gap-3">
                <input type="radio" name="pay" defaultChecked={def as boolean} className="accent-emerald-500" />
                <span className="font-medium">{label}</span>
              </span>
              <span className="text-xs text-gray-400">{desc}</span>
            </label>
          ))}
        </div>

        <Notice tone="blue">
          예치금은 마일스톤별 QA 리포트 &lsquo;통과&rsquo; 시에만 업체로 송금됩니다 (48시간 이내). 분쟁 신청 시 해당 마일스톤 대금은 자동 보류됩니다.
        </Notice>

        {deposited ? (
          <div className="mt-6 rounded-xl bg-emerald-50 p-6 text-center">
            <p className="text-lg font-bold text-emerald-700">✓ 예치 완료</p>
            <p className="mt-1 text-sm text-emerald-600">업체에 예치 완료 알림이 발송되었습니다. 공사 시작 승인이 활성화되었습니다.</p>
            <Link href="/project" className="mt-4 inline-block rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-slate-700">
              공사 진행 관리로 →
            </Link>
          </div>
        ) : (
          <button onClick={() => setDeposited(true)} className="mt-6 w-full rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white hover:bg-emerald-600">
            AED {fmt(contract.totalAmount)} 에스크로 예치하기
          </button>
        )}
      </Card>
    </div>
  );
}
