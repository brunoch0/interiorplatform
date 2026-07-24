"use client";

import { useState } from "react";
import { Card, FileDrop, Notice, PageHeader, Steps } from "@/components/ui";

export default function CompleteReview() {
  const [certified, setCertified] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [delay, setDelay] = useState<string | null>(null);
  const [extra, setExtra] = useState<string | null>(null);
  const [quality, setQuality] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const canSubmit = certified && agreed && delay && extra && quality;

  if (done)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="text-5xl">🎉</span>
        <h1 className="mt-4 text-2xl font-bold">인증 리뷰가 게시되었습니다</h1>
        <p className="mt-3 text-sm text-gray-500">
          작성해주신 정량 지표는 업체 신뢰 지표 산출에 즉시 반영됩니다. 동일 거래에 대한 리뷰는 1회만 작성 가능하며 사후 수정은 허용되지 않습니다.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader title="공사 완료 및 인증 리뷰" desc="알누르 인테리어 · Business Bay 아파트 3BR · 2026-09-12 완공" />
      <Steps items={["완료 증빙 인증", "정량 체크리스트", "게시"]} current={certified ? 1 : 0} />

      {/* Step 1: 증빙 인증 */}
      <Card className="mb-6">
        <h2 className="font-bold">1. 공사 완료 증빙 인증</h2>
        <p className="mt-1 text-sm text-gray-500">공사 완료 승인서 또는 최종 대금 영수증을 업로드해야 리뷰 양식이 활성화됩니다.</p>
        {certified ? (
          <Notice tone="green">✓ 문서 유효성 검증 완료 — completion_cert_0912.pdf · 리뷰 양식이 활성화되었습니다.</Notice>
        ) : (
          <div className="mt-4">
            <FileDrop label="공사 완료 승인서 / 최종 대금 영수증 업로드" />
            <button onClick={() => setCertified(true)} className="mt-3 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-700">
              업로드 및 유효성 검증 (데모)
            </button>
          </div>
        )}
      </Card>

      {/* Step 2: 정량 체크리스트 */}
      <Card className={`mb-6 ${certified ? "" : "pointer-events-none opacity-40"}`}>
        <h2 className="font-bold">2. 정량 지표 체크리스트</h2>
        <p className="mt-1 text-sm text-gray-500">별점 대신 사실 기반 정량 항목으로만 평가합니다.</p>
        <div className="mt-5 space-y-5">
          <div>
            <p className="text-sm font-medium">공기 준수 여부 (예정 대비 실제 완료)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["예정일 준수", "1–7일 지연", "8–30일 지연", "30일 초과 지연"].map((o) => (
                <button key={o} onClick={() => setDelay(o)} className={`rounded-full border px-4 py-1.5 text-sm ${delay === o ? "border-slate-900 bg-slate-900 text-white" : "border-gray-200 text-gray-600"}`}>{o}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">정부 승인 소요 기간</p>
            <select className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <option>2주 이내</option><option>3–4주</option><option>5주 이상</option><option>해당 없음</option>
            </select>
          </div>
          <div>
            <p className="text-sm font-medium">계약 외 추가 비용 청구</p>
            <div className="mt-2 flex gap-2">
              {["무", "유 (합의된 변경)", "유 (무단 청구)"].map((o) => (
                <button key={o} onClick={() => setExtra(o)} className={`rounded-full border px-4 py-1.5 text-sm ${extra === o ? "border-slate-900 bg-slate-900 text-white" : "border-gray-200 text-gray-600"}`}>{o}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">시공 품질 전반</p>
            <div className="mt-2 flex gap-2">
              {["양호", "불만"].map((o) => (
                <button key={o} onClick={() => setQuality(o)} className={`rounded-full border px-4 py-1.5 text-sm ${quality === o ? "border-slate-900 bg-slate-900 text-white" : "border-gray-200 text-gray-600"}`}>{o}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">사실 서술 (200자 이내 · 감정적 표현 불가)</p>
            <textarea rows={3} maxLength={200} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="예: 12주 공기 준수. DM 승인 2주 완료. 최종 금액 계약과 동일." />
            <p className="mt-1 text-right text-xs text-gray-400">0/200</p>
          </div>
        </div>
      </Card>

      <label className={`flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm ${certified ? "" : "pointer-events-none opacity-40"}`}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-emerald-500" />
        <span className="leading-relaxed text-gray-600">
          <b>UAE 명예훼손법 가이드라인에 동의합니다.</b> 리뷰는 사실 관계만 서술하며, 주관적 비방·모욕 표현이 포함될 경우 게시가 제한될 수 있음을 이해합니다. (미동의 시 제출 불가)
        </span>
      </label>

      <button
        onClick={() => setDone(true)}
        disabled={!canSubmit}
        className="mt-5 w-full rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white hover:bg-emerald-600 disabled:bg-gray-300"
      >
        인증 리뷰 게시하기
      </button>
    </div>
  );
}
