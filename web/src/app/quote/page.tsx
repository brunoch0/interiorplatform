"use client";

import { useState } from "react";
import Link from "next/link";
import { companies } from "@/lib/data";
import { Badge, Card, Notice, PageHeader, Steps } from "@/components/ui";

const preselected = ["c1", "c2", "c8"];

export default function QuoteRequest() {
  const [targets, setTargets] = useState<string[]>(preselected);
  const [sent, setSent] = useState(false);
  const verified = companies.filter((c) => c.verified);

  const toggle = (id: string) =>
    setTargets((t) => (t.includes(id) ? t.filter((x) => x !== id) : t.length < 5 ? [...t, id] : t));

  if (sent)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="text-5xl">📨</span>
        <h1 className="mt-4 text-2xl font-bold">견적 요청이 발송되었습니다</h1>
        <p className="mt-2 text-sm text-gray-500">
          선택한 {targets.length}개 업체에 동시 발송 완료. 각 업체는 <b>7일 이내</b>에 견적서를 제출해야 하며, 도착 시 알림을 보내드립니다.
        </p>
        <Link href="/quote/compare" className="mt-8 inline-block rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-slate-700">
          견적서 비교 화면으로 →
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title="복수 견적 요청 발송" desc="최대 5개 업체에 동일한 요청서를 한 번에 발송합니다." />
      <Steps items={["업체 선택", "요청서 작성", "발송"]} current={1} />

      <Card className="mb-6">
        <h2 className="mb-3 font-bold">선택된 업체 ({targets.length}/5)</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {verified.map((c) => (
            <label
              key={c.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                targets.includes(c.id) ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <input type="checkbox" checked={targets.includes(c.id)} onChange={() => toggle(c.id)} className="accent-emerald-500" />
                <span className="font-medium">{c.name}</span>
              </span>
              <Badge tone="green">공기 {c.scheduleComplianceRate}%</Badge>
            </label>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-4 font-bold">견적 요청서</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">공간 유형</label>
            <select className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <option>아파트 3BR</option>
              <option>아파트 1–2BR</option>
              <option>빌라</option>
              <option>상업 공간</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">예산 범위</label>
            <select className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <option>AED 100K–200K</option>
              <option>AED 50K–100K</option>
              <option>AED 200K–500K</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">위치</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" defaultValue="Business Bay, Executive Towers" />
          </div>
          <div>
            <label className="text-sm font-medium">희망 착공 시기</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" defaultValue="2026년 8월 중" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium">희망 사항</label>
          <textarea
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
            rows={4}
            defaultValue="9월 말 입주 전 완공 희망. 주방 확장 + 욕실 2개 전면 교체. 한국식 수납 시스템 선호. DM 승인 대행 포함 견적 요청드립니다."
          />
        </div>
      </Card>

      <Notice tone="blue">
        발송 후 각 업체는 리드 수수료를 부담하고 요청을 수락합니다. 미수락 시 다음 순위 업체에 자동 전달됩니다. 발송 현황은 마이페이지에서 확인할 수 있습니다.
      </Notice>

      <button
        onClick={() => setSent(true)}
        disabled={targets.length === 0}
        className="mt-6 w-full rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:bg-gray-300"
      >
        {targets.length}개 업체에 동시 견적 요청 발송
      </button>
    </div>
  );
}
