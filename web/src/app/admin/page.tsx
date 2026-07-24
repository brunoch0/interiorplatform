import Link from "next/link";
import { disputes, fmt, kpi, licenseApplications } from "@/lib/data";
import { Card, PageHeader, Stat } from "@/components/ui";

export default function AdminHome() {
  const cur = kpi.monthly[kpi.monthly.length - 1];
  const pendingLicenses = licenseApplications.filter((l) => l.status === "심사중").length;
  const openDisputes = disputes.filter((d) => d.status !== "중재완료").length;

  return (
    <div>
      <PageHeader title="운영자 대시보드" desc="2026-07-24 기준 · 실시간 집계" />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="등록 업체 (누적)" value={fmt(cur.companies)} sub="Claim 완료 96개" tone="good" />
        <Stat label="이번 달 견적 요청" value={fmt(cur.quotes)} sub="전월 대비 +17%" tone="good" />
        <Stat label="심사 대기 라이선스" value={`${pendingLicenses}건`} sub="평균 처리 1.4일" tone={pendingLicenses > 0 ? "bad" : "default"} />
        <Stat label="진행 중 분쟁" value={`${openDisputes}건`} sub="분쟁률 3.1%" />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">처리 대기 업무</h2>
          </div>
          <div className="space-y-2 text-sm">
            <Link href="/admin/licenses" className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 hover:bg-amber-100">
              <span>📜 라이선스 심사 대기</span><b className="text-amber-700">{pendingLicenses}건</b>
            </Link>
            <Link href="/admin/disputes" className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 hover:bg-red-100">
              <span>⚖️ 분쟁 중재 검토</span><b className="text-red-600">{openDisputes}건</b>
            </Link>
            <Link href="/admin/inspections" className="flex items-center justify-between rounded-xl bg-sky-50 px-4 py-3 hover:bg-sky-100">
              <span>🏗️ 감리 재예약 승인 대기</span><b className="text-sky-700">1건</b>
            </Link>
            <Link href="/admin/reviews" className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100">
              <span>🔍 리뷰 신고 검토</span><b>2건</b>
            </Link>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-bold">이번 달 수익 (1단계 모델)</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <span>리드 연결 수수료</span><b>AED {fmt(kpi.leadRevenue)}</b>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <span>노출 패키지 판매</span><b>AED {fmt(kpi.packageRevenue)}</b>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-sm text-white">
              <span>합계</span><b>AED {fmt(kpi.leadRevenue + kpi.packageRevenue)}</b>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">인증 리뷰 작성률 {kpi.reviewRate}% (목표 40% 달성) · 에스크로 계약 {cur.escrow}건</p>
        </Card>
      </div>
    </div>
  );
}
