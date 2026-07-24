"use client";

import { useState } from "react";
import { contract, fmt } from "@/lib/data";
import { BackLink, Card, FileDrop, Notice, PageHeader } from "@/components/ui";

export default function DisputeFile() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="text-5xl">⚖️</span>
        <h1 className="mt-4 text-2xl font-bold">분쟁이 접수되었습니다</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
          접수번호 <b>DSP-2026-0724-01</b> · 해당 마일스톤(M2)의 에스크로 대금 <b>AED {fmt(36250)}</b>이 자동 보류되었으며,
          운영자 중재 프로세스가 시작되었습니다. 다른 마일스톤 대금 지급은 영향을 받지 않습니다.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <BackLink href="/project" label="공사 진행 관리로" />
      <PageHeader title="분쟁 신청" desc="신청 즉시 해당 마일스톤의 에스크로 대금이 자동 보류되고 운영자 중재가 시작됩니다." />

      <Card>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium">대상 마일스톤</label>
            <select className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              {contract.milestones.map((m, i) => (
                <option key={m.id}>M{i + 1}. {m.name} (대금 AED {fmt((contract.totalAmount * m.ratio) / 100)})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">분쟁 유형</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["자재 상이", "시공 하자", "공기 지연", "무단 추가 비용", "기타"].map((t) => (
                <label key={t} className="cursor-pointer rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 has-[:checked]:border-red-400 has-[:checked]:bg-red-50 has-[:checked]:text-red-600">
                  <input type="radio" name="type" className="hidden" /> {t}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">신청 사유 (사실 관계 중심으로 서술)</label>
            <textarea
              rows={5}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              placeholder="예: 계약서 별첨2에 명시된 스위치 브랜드(레그랑)와 다른 자재가 설치되어 있음을 7/20 현장에서 확인했습니다."
            />
          </div>
          <div>
            <label className="text-sm font-medium">증빙 자료 첨부</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <FileDrop label="사진 증빙" hint="JPG, PNG · 최대 10장" />
              <FileDrop label="문서 증빙" hint="계약서, 견적서 등 PDF" />
            </div>
          </div>
          <Notice tone="amber">
            분쟁 남용 방지를 위해 허위 신청 확인 시 이용 제한이 적용될 수 있습니다. 운영자는 양측 증빙을 검토 후 대금 보류 해제 또는 환불을 결정합니다.
          </Notice>
          <button onClick={() => setSubmitted(true)} className="w-full rounded-xl bg-red-500 py-4 text-sm font-bold text-white hover:bg-red-600">
            분쟁 신청 및 대금 보류 실행
          </button>
        </div>
      </Card>
    </div>
  );
}
