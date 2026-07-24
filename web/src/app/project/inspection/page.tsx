import { BackLink, Badge, Card, Notice, PageHeader } from "@/components/ui";

export default function InspectionSchedule() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <BackLink href="/project" label="공사 진행 관리로" />
      <PageHeader title="감리 일정 예약" desc="마일스톤 도래 시 자동 생성된 감리 예약을 확인합니다. 마일스톤별 1회 예약 원칙, 재예약은 운영자 승인이 필요합니다." />

      <Card className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">M2. 전기·배관 공사 점검</h2>
          <Badge tone="green">확정</Badge>
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-gray-400">방문 일시</dt><dd className="font-bold">2026-07-26 (일) 10:00</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">담당 감리</dt><dd>정감리 (전기·설비 전문, 경력 14년)</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">점검 항목</dt><dd>배선·배관 규격, 통전 테스트, 방수 사전 점검</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">참석</dt><dd>업체 현장소장 필수 · 소비자 선택</dd></div>
        </dl>
        <Notice tone="blue">확정 일시는 소비자·업체 양측에 알림으로 발송되었습니다. 점검 완료 후 QA 리포트가 자동 발행됩니다.</Notice>
      </Card>

      <Card>
        <h2 className="font-bold">지난 감리 이력</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span>M1. 철거 및 기초 공사 점검</span>
            <span className="flex items-center gap-2 text-xs text-gray-400">2026-07-04 <Badge tone="green">통과</Badge></span>
          </div>
        </div>
        <button className="mt-5 w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-500 hover:border-gray-400">
          재예약 요청 (운영자 승인 필요)
        </button>
      </Card>
    </div>
  );
}
