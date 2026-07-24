"use client";

import { useState } from "react";
import { Card, FileDrop, Notice, PageHeader, Steps } from "@/components/ui";

export default function LicenseUpload() {
  const [step, setStep] = useState(0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader
        title="소유권 주장(Claim) — 라이선스 인증"
        desc="3단계 간소화 온보딩. 운영자 심사 승인 후 프로필 소유권이 이전되고 포트폴리오 등록이 활성화됩니다."
      />
      <Steps items={["기본 정보 확인", "무역 라이선스", "DET 라이선스"]} current={step} />

      {step === 0 && (
        <Card>
          <h2 className="font-bold">1단계 — 프로필 기본 정보 확인</h2>
          <p className="mt-1 text-sm text-gray-500">플랫폼에 등록된 정보가 귀사와 일치하는지 확인해 주세요.</p>
          <dl className="mt-5 space-y-3 rounded-xl bg-gray-50 p-5 text-sm">
            <div className="flex justify-between"><dt className="text-gray-400">업체명</dt><dd className="font-semibold">걸프 크래프트 컨트랙팅 (Gulf Craft Contracting)</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">지역</dt><dd>Al Quoz</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">연락처</dt><dd>+971 4 3XX XXXX</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">카테고리</dt><dd>목공 · 도장</dd></div>
          </dl>
          <Notice tone="blue">본 프로필은 공개 정보 기반으로 자동 생성된 &lsquo;미인증&rsquo; 프로필입니다. 정보가 다르면 심사 과정에서 수정 요청할 수 있습니다.</Notice>
          <button onClick={() => setStep(1)} className="mt-5 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-slate-700">
            정보 일치 — 다음 단계 →
          </button>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <h2 className="font-bold">2단계 — 무역 라이선스 업로드</h2>
          <p className="mt-1 text-sm text-gray-500">유효기간 내 무역 라이선스(Trade License) 사본을 업로드하세요.</p>
          <div className="mt-5">
            <FileDrop label="무역 라이선스 업로드" hint="PDF, JPG · 최대 10MB" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">라이선스 번호</label>
              <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="예: 887123" />
            </div>
            <div>
              <label className="text-sm font-medium">만료일</label>
              <input type="date" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </div>
          </div>
          <button onClick={() => setStep(2)} className="mt-5 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-slate-700">
            업로드 완료 — 다음 단계 →
          </button>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <h2 className="font-bold">3단계 — DET 인테리어/피트아웃 라이선스 업로드</h2>
          <p className="mt-1 text-sm text-gray-500">DET 공식 인테리어/피트아웃 활동 라이선스를 업로드하세요. 유효성은 DET 연동으로 검증됩니다.</p>
          <div className="mt-5">
            <FileDrop label="DET 라이선스 업로드" hint="PDF, JPG · 최대 10MB" />
          </div>
          <Notice>
            제출 후 운영자 심사는 영업일 기준 1–2일 소요됩니다. 승인 시 프로필 소유권 이전 + 포트폴리오 등록 활성화, 반려 시 사유와 재제출 안내가 앱 푸시로 발송됩니다.
          </Notice>
          <button onClick={() => setStep(3)} className="mt-5 w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white hover:bg-emerald-600">
            심사 제출하기
          </button>
        </Card>
      )}

      {step === 3 && (
        <Card className="text-center">
          <span className="text-5xl">✅</span>
          <h2 className="mt-4 text-xl font-bold">심사 접수 완료</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
            접수번호 <b>CLM-2026-0724-18</b> · 운영자 심사 후 결과가 앱 푸시 알림으로 발송됩니다. 중도 이탈하셔도 리마인더로 이어서 진행하실 수 있습니다.
          </p>
        </Card>
      )}
    </div>
  );
}
