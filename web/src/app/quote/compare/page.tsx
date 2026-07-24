import Link from "next/link";
import { fmt, getCompany, quoteRequests } from "@/lib/data";
import { Badge, Card, PageHeader } from "@/components/ui";

export default function QuoteCompare() {
  const received = quoteRequests.filter((q) => q.status === "견적수신");
  const pending = quoteRequests.filter((q) => q.status !== "견적수신");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title="견적서 비교" desc="2026-07-18 발송 · 아파트 3BR · Business Bay · 수신 3건 / 대기 1건" />

      <div className="grid gap-5 md:grid-cols-3">
        {received.map((q) => {
          const c = getCompany(q.companyId)!;
          const lowest = Math.min(...received.map((r) => r.amount!));
          return (
            <Card key={q.id} className={q.amount === lowest ? "ring-2 ring-emerald-400" : ""}>
              <div className="flex items-center justify-between">
                <h2 className="font-bold">{c.name}</h2>
                {q.amount === lowest && <Badge tone="green">최저가</Badge>}
              </div>
              <p className="mt-0.5 text-xs text-gray-400">{c.area}</p>
              <p className="mt-4 text-3xl font-black">
                <span className="text-base font-semibold text-gray-400">AED </span>
                {fmt(q.amount!)}
              </p>
              <dl className="mt-4 space-y-2 border-t border-gray-50 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-gray-400">예상 공기</dt><dd className="font-semibold">{q.durationWeeks}주</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">공기 준수율</dt><dd className="font-semibold text-emerald-600">{c.scheduleComplianceRate}%</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">추가비용 미청구율</dt><dd className="font-semibold">{c.noExtraChargeRate}%</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">인증 리뷰</dt><dd className="font-semibold">{c.verifiedReviewCount}건</dd></div>
              </dl>
              <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">{q.note}</p>
              <Link
                href={`/quote/confirm?c=${c.id}`}
                className="mt-4 block w-full rounded-xl bg-slate-900 py-3 text-center text-sm font-bold text-white hover:bg-slate-700"
              >
                이 업체 선택
              </Link>
            </Card>
          );
        })}
      </div>

      {pending.length > 0 && (
        <Card className="mt-6">
          <h3 className="text-sm font-bold text-gray-500">응답 대기 중</h3>
          {pending.map((q) => {
            const c = getCompany(q.companyId)!;
            return (
              <div key={q.id} className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
                <span>{c.name}</span>
                <span className="text-xs text-gray-400">제출 기한: 2026-07-25 (D-1)</span>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
