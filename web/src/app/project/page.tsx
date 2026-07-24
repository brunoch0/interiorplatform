import Link from "next/link";
import { contract, fmt } from "@/lib/data";
import { Badge, Card, PageHeader, Stat } from "@/components/ui";

const statusTone: Record<string, "green" | "blue" | "gray" | "amber" | "red"> = {
  완료: "green", 진행중: "blue", 대기: "gray", 감리대기: "amber", 분쟁: "red",
};

export default function ProjectDashboard() {
  const done = contract.milestones.filter((m) => m.status === "완료").length;
  const progress = Math.round((done / contract.milestones.length) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="공사 진행 관리"
        desc={`알누르 인테리어 · Business Bay 아파트 3BR · ${contract.startDate} 착공`}
        action={
          <div className="flex gap-2">
            <Link href="/project/dispute" className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">분쟁 신청</Link>
            <Link href="/project/inspection" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">감리 일정</Link>
          </div>
        }
      />

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Stat label="전체 진행률" value={`${progress}%`} sub={`마일스톤 ${done}/${contract.milestones.length} 완료`} tone="good" />
        <Stat label="에스크로 잔액" value={`AED ${fmt(116000)}`} sub={`총 예치 AED ${fmt(contract.totalAmount)}`} />
        <Stat label="예정 완공일" value={contract.endDate} sub="현재 공기 준수 중" tone="good" />
        <Stat label="다음 감리" value="07-26 10:00" sub="전기·배관 공사 점검" />
      </div>

      <Card>
        <h2 className="mb-5 font-bold">마일스톤 현황</h2>
        <div className="space-y-4">
          {contract.milestones.map((m, i) => (
            <div key={m.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 p-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                m.status === "완료" ? "bg-emerald-500 text-white" : m.status === "감리대기" ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {m.status === "완료" ? "✓" : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{m.name}</p>
                  <Badge tone={statusTone[m.status]}>{m.status}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-gray-400">기한 {m.dueDate} · 대금 {m.ratio}% (AED {fmt((contract.totalAmount * m.ratio) / 100)})</p>
              </div>
              <div className="text-right text-xs">
                <Badge tone={m.escrowStatus === "송금완료" ? "green" : m.escrowStatus === "보류" ? "red" : "gray"}>
                  에스크로 {m.escrowStatus}
                </Badge>
              </div>
              {m.status === "감리대기" && (
                <Link href="/project/qa-report" className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700">
                  QA 리포트 →
                </Link>
              )}
              {m.status === "완료" && (
                <Link href="/project/qa-report" className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-500 hover:border-gray-400">
                  리포트 보기
                </Link>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-50 pt-5">
          <Link href="/project/checklist" className="text-sm font-medium text-sky-600 hover:underline">감리단 체크리스트 화면 →</Link>
          <Link href="/project/complete" className="text-sm font-medium text-emerald-600 hover:underline">공사 완료 및 인증 리뷰 →</Link>
        </div>
      </Card>
    </div>
  );
}
