"use client";

import { useState } from "react";
import { licenseApplications, type LicenseApplication } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

const tone: Record<LicenseApplication["status"], "amber" | "green" | "red"> = {
  심사중: "amber", 승인: "green", 반려: "red",
};

export default function AdminLicenses() {
  const [apps, setApps] = useState(licenseApplications);

  const decide = (id: string, status: "승인" | "반려") =>
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status, rejectReason: status === "반려" ? "서류 판독 불가 — 재제출 요청" : undefined } : a)));

  return (
    <div>
      <PageHeader title="라이선스 인증 심사" desc="승인/반려 처리 결과는 업체에 즉시 앱 푸시로 발송됩니다. 승인 시 프로필 소유권이 이전됩니다." />
      <Notice tone="blue">라이선스 만료 30일 전 자동 갱신 알림이 발송되며, 미갱신 시 프로필이 자동 비활성화됩니다.</Notice>

      <div className="mt-6 space-y-4">
        {apps.map((a) => (
          <Card key={a.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{a.companyName}</p>
                  <Badge tone={tone[a.status]}>{a.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-400">접수 {a.submittedAt} · Claim ID {a.id.toUpperCase()}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-lg border border-gray-200 px-3 py-1.5">📄 {a.tradeLicense}</span>
                  <span className="rounded-lg border border-gray-200 px-3 py-1.5">📄 {a.detLicense}</span>
                  <button className="rounded-lg bg-gray-100 px-3 py-1.5 font-medium hover:bg-gray-200">DET 유효성 조회</button>
                </div>
                {a.rejectReason && <p className="mt-2 text-xs text-red-500">반려 사유: {a.rejectReason}</p>}
              </div>
              {a.status === "심사중" && (
                <div className="flex gap-2">
                  <button onClick={() => decide(a.id, "반려")} className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">반려</button>
                  <button onClick={() => decide(a.id, "승인")} className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600">승인 — 소유권 이전</button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 font-bold">심사 이력</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-400">
            <tr><th className="pb-2">일시</th><th className="pb-2">업체</th><th className="pb-2">처리</th><th className="pb-2">담당</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr><td className="py-2">2026-07-10</td><td>다운타운 스페이스웍스</td><td><Badge tone="green">승인</Badge></td><td>운영자A</td></tr>
            <tr><td className="py-2">2026-07-08</td><td>퀵픽스 데코</td><td><Badge tone="red">반려</Badge></td><td>운영자A</td></tr>
            <tr><td className="py-2">2026-07-02</td><td>세리니티 인테리어</td><td><Badge tone="green">갱신 승인</Badge></td><td>운영자B</td></tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
