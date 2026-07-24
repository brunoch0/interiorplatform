import { inspections } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

export default function AdminInspections() {
  return (
    <div>
      <PageHeader title="전문 감리단 일정 및 리포트 관리" desc="감리 일정 변경 요청 승인, 리포트 수정·재발행, 감리단 커뮤니케이션을 관리합니다." />

      <Card className="mb-6">
        <h2 className="mb-4 font-bold">감리 일정 현황</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-400">
            <tr><th className="pb-2">일시</th><th className="pb-2">계약</th><th className="pb-2">마일스톤</th><th className="pb-2">감리</th><th className="pb-2">상태</th><th className="pb-2"></th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inspections.map((i) => (
              <tr key={i.id}>
                <td className="py-3 text-xs">{i.date}</td>
                <td className="py-3">{i.companyName}<p className="text-xs text-gray-400">{i.consumer}</p></td>
                <td className="py-3 text-xs">{i.milestone}</td>
                <td className="py-3 text-xs">{i.inspector}</td>
                <td className="py-3"><Badge tone={i.status === "확정" ? "green" : "amber"}>{i.status}</Badge></td>
                <td className="py-3 text-right">
                  {i.status === "승인대기" && (
                    <span className="flex justify-end gap-1.5">
                      <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white">재예약 승인</button>
                      <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">거부</button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-gray-400">승인·거부 결정은 감리단, 소비자, 업체에게 자동 안내됩니다. 승인된 일정만 시스템에 최종 반영됩니다.</p>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold">감리단 커뮤니케이션</h2>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-500">정감리 · 10:32</p>
              <p className="mt-1">M2 점검 중 실리콘 마감 재시공 필요 확인. 업체에 보완 요청 발송 부탁드립니다.</p>
            </div>
            <div className="rounded-xl bg-sky-50 p-3 text-right">
              <p className="text-xs font-semibold text-sky-600">운영자A · 10:45</p>
              <p className="mt-1">확인했습니다. 보완 요청 알림 발송 완료. 재점검 일정 잡히면 공유주세요.</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm" placeholder="메시지 입력 (푸시 알림 발송됨)" />
            <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white">전송</button>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-bold">리포트 수정·재발행</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span>QA-2026-0726-A2 (알누르 · M2)</span>
              <span className="flex gap-1.5">
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">수정</button>
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">재발행</button>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span>QA-2026-0704-A1 (알누르 · M1)</span>
              <span className="flex gap-1.5">
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">수정</button>
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">재발행</button>
              </span>
            </div>
          </div>
          <Notice tone="blue">수정·재발행 시 변경 사항이 소비자·업체에게 투명하게 공지되며, 수정된 리포트는 앱에서 즉시 확인 가능합니다.</Notice>
        </Card>
      </div>
    </div>
  );
}
