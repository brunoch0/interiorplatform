import { qaChecklist } from "@/lib/data";
import { BackLink, Badge, Card, Notice, PageHeader } from "@/components/ui";

export default function QAReport() {
  const passed = qaChecklist.filter((q) => q.result === "통과").length;
  const failed = qaChecklist.filter((q) => q.result === "미통과");
  const overall = failed.length === 0 && qaChecklist.every((q) => !q.required || q.result !== null);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <BackLink href="/project" label="공사 진행 관리로" />
      <PageHeader
        title="QA 리포트"
        desc="M2. 전기·배관 공사 · 리포트 No. QA-2026-0726-A2 · 발행 즉시 소비자·업체 양측 앱에서 확인 가능"
        action={<button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:border-gray-400">PDF 다운로드</button>}
      />

      <Card className={`mb-6 text-center ${overall ? "bg-emerald-50" : "bg-red-50"}`}>
        <p className="text-xs text-gray-500">종합 판정</p>
        <p className={`mt-1 text-3xl font-black ${overall ? "text-emerald-600" : "text-red-600"}`}>
          {overall ? "통과" : "미통과 (보완 요청)"}
        </p>
        <p className="mt-2 text-xs text-gray-500">점검일 2026-07-26 · 감리 정감리 · 항목 {passed}/{qaChecklist.length} 통과</p>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-4 font-bold">항목별 점검 결과</h2>
        <div className="space-y-2">
          {qaChecklist.map((q) => (
            <div key={q.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{q.label}</p>
                {q.comment && <p className="text-xs text-gray-400">{q.comment} {q.photos > 0 && `· 📷 ${q.photos}장`}</p>}
              </div>
              {q.result === "통과" && <Badge tone="green">통과</Badge>}
              {q.result === "미통과" && <Badge tone="red">미통과</Badge>}
              {q.result === null && <Badge tone="gray">미점검</Badge>}
            </div>
          ))}
        </div>
      </Card>

      {overall ? (
        <Notice tone="green">
          ✓ 통과 리포트 발행으로 <b>M2 에스크로 대금 (AED 36,250) 송금이 자동 트리거</b>되었습니다. 업체 계좌 입금은 48시간 이내 처리됩니다.
        </Notice>
      ) : (
        <Notice tone="red">
          미통과 항목 {failed.length}건 — 해당 마일스톤 대금은 <b>에스크로에 보류</b>되며, 업체에 보완 요청 알림이 발송되었습니다. 재점검 리포트 통과 후 송금됩니다.
          <ul className="mt-2 list-disc pl-5 text-xs">
            {failed.map((f) => <li key={f.id}>{f.label}: {f.comment}</li>)}
          </ul>
        </Notice>
      )}

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4 text-xs text-gray-400">
        감리단 서명: 정감리 (디지털 서명 완료 2026-07-26 16:10) · 리포트 삭제·재발행은 플랫폼 운영자만 처리할 수 있습니다.
      </div>
    </div>
  );
}
