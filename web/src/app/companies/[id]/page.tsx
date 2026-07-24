import Link from "next/link";
import { notFound } from "next/navigation";
import { fmt, getCompany, reviews } from "@/lib/data";
import { Badge, BackLink, Card, MetricValue, Notice, Placeholder } from "@/components/ui";

export default async function CompanyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCompany(id);
  if (!c) notFound();
  const companyReviews = reviews.filter((r) => r.companyId === c.id);

  const metrics = [
    { label: "공기 준수율", value: c.scheduleComplianceRate, suffix: "%", tip: "인증 리뷰 기준, 예정 공기 ±3일 이내 완료 비율" },
    { label: "추가 비용 미청구율", value: c.noExtraChargeRate, suffix: "%", tip: "계약 외 추가 비용 청구가 없었던 공사 비율 (합의된 변경 계약 제외)" },
    { label: "인증 리뷰", value: c.verifiedReviewCount, suffix: "건", tip: "공사 완료 승인서 또는 최종 대금 영수증으로 인증된 리뷰 수" },
    { label: "정부 승인 평균 소요", value: c.avgApprovalWeeks, suffix: "주", tip: "DM 등 정부 승인 접수부터 완료까지 평균 소요 주수" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <BackLink href="/companies" label="업체 목록으로" />

      {/* Header */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="w-24 shrink-0">
              <Placeholder label="" ratio="aspect-square" hue={200} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{c.name}</h1>
                {c.verified ? <Badge tone="green">인증 완료</Badge> : <Badge tone="gray">미인증</Badge>}
                {c.exposurePackage === "premium" && <Badge tone="amber">프리미엄</Badge>}
              </div>
              <p className="mt-1 text-sm text-gray-400">{c.nameEn} · {c.area} · 견적 {c.priceRange}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.categories.map((cat) => (
                  <Badge key={cat} tone="blue">{cat}</Badge>
                ))}
              </div>
              {c.verified && (
                <p className="mt-2 text-xs text-gray-400">DET 라이선스 유효기간: {c.licenseExpiry} · 플랫폼 자동 검증</p>
              )}
            </div>
          </div>
          {c.verified ? (
            <Link href="/quote" className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-600">
              견적 요청 담기
            </Link>
          ) : (
            <Link href="/supplier/license" className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-slate-700">
              이 업체의 소유자이신가요? 소유권 주장 →
            </Link>
          )}
        </div>
      </Card>

      {/* 정량 신뢰 지표 대시보드 */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">정량 신뢰 지표</h2>
          <span className="text-xs text-gray-400">인증 리뷰 데이터 자동 산출 · 업체 수정 불가</span>
        </div>
        {c.verifiedReviewCount < 3 ? (
          <Notice tone="amber">
            인증 리뷰가 3건 미만으로 <b>데이터 부족</b> 상태입니다. 지표 수치는 리뷰 3건 이상부터 공개됩니다.
          </Notice>
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="group relative rounded-xl bg-gray-50 p-5 text-center">
                <p className="text-3xl font-black text-slate-900">
                  <MetricValue value={m.value} suffix={m.suffix} />
                </p>
                <p className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-500">
                  {m.label}
                  <span className="cursor-help rounded-full bg-gray-200 px-1.5 text-[10px] text-gray-500" title={m.tip}>?</span>
                </p>
                <div className="pointer-events-none absolute inset-x-2 -bottom-2 z-10 translate-y-full rounded-lg bg-slate-900 p-3 text-left text-[11px] leading-relaxed text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                  {m.tip}
                  <p className="mt-1 text-[10px] text-slate-400">※ 본 지표는 사실 데이터 기반이며 법적 평가를 의미하지 않습니다.</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Portfolio */}
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">포트폴리오 · 시공 사례</h2>
              <span className="text-xs text-gray-400">{c.portfolioCount}건 등록</span>
            </div>
            {c.verified ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Placeholder label={i % 2 === 0 ? "BEFORE" : "AFTER"} hue={180 + i * 20} />
                    <p className="mt-1.5 text-xs text-gray-500">{["Business Bay 2BR", "빌라 주방 리모델", "Marina 오피스"][i % 3]}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Notice>미인증 프로필은 기본 정보만 노출됩니다. 소유권 인증 후 포트폴리오가 공개됩니다.</Notice>
            )}
          </Card>

          {/* Reviews */}
          <Card className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">인증 리뷰</h2>
              <span className="text-xs text-gray-400">공사 완료 증빙 인증 리뷰만 게시됩니다</span>
            </div>
            {companyReviews.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">아직 인증 리뷰가 없습니다.</p>
            ) : (
              <div className="space-y-4">
                {companyReviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <Badge tone="green">✓ 인증됨</Badge>
                      <span>{r.author}</span>·<span>{r.spaceType}</span>·<span>{r.date}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className={`font-bold ${r.scheduleDelayDays === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                          {r.scheduleDelayDays === 0 ? "공기 준수" : `+${r.scheduleDelayDays}일 지연`}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center"><p className="font-bold">승인 {r.approvalWeeks}주</p></div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className={`font-bold ${r.extraCharge ? "text-amber-600" : "text-emerald-600"}`}>추가비용 {r.extraCharge ? "유" : "무"}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center"><p className="font-bold">품질 {r.qualityOk ? "양호" : "불만"}</p></div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{r.factNote}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-bold">기본 정보</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-400">지역</dt><dd>{c.area}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">시공 공간</dt><dd>{c.spaceTypes.join(", ")}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">평균 견적대</dt><dd>{c.priceRange}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">인증 리뷰</dt><dd>{fmt(c.verifiedReviewCount)}건</dd></div>
            </dl>
            <p className="mt-4 border-t border-gray-50 pt-4 text-sm leading-relaxed text-gray-500">{c.intro}</p>
          </Card>
          <Card>
            <h3 className="font-bold">안전 거래 안내</h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-gray-500">
              <li>✓ 계약 전 플랫폼 표준 계약서 사용을 권장합니다</li>
              <li>✓ 에스크로 예치 시 마일스톤별 감리 통과 후에만 대금이 송금됩니다</li>
              <li>✓ 플랫폼 외 직거래 시 분쟁 중재 지원이 제한됩니다</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
