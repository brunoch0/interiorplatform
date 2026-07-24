import Link from "next/link";
import { companies, fmt } from "@/lib/data";
import { Badge, Card, MetricValue, Placeholder } from "@/components/ui";

export default function Home() {
  const featured = companies.filter((c) => c.verified).slice(0, 3);
  return (
    <div>
      {/* Hero + Search */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold text-emerald-400">DUBAI TRUSTED INTERIOR PLATFORM</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
            별점이 아닌 <span className="text-emerald-400">데이터</span>로,
            <br />
            검증된 두바이 인테리어 업체를 찾으세요
          </h1>
          <p className="mt-4 max-w-xl text-slate-300">
            공기 준수율 · 추가 비용 청구 이력 · DM 승인 처리 속도. 인증 리뷰 기반 정량 지표만 제공합니다.
          </p>
          <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 sm:flex-row">
            <select className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900">
              <option>공간 유형: 전체</option>
              <option>아파트</option>
              <option>빌라</option>
              <option>상업 공간</option>
            </select>
            <select className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900">
              <option>지역: 전체</option>
              <option>Business Bay</option>
              <option>Dubai Marina</option>
              <option>Downtown</option>
              <option>Palm Jumeirah</option>
            </select>
            <Link
              href="/companies"
              className="rounded-xl bg-emerald-500 px-8 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              업체 검색
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              ["476", "등록 업체"],
              ["96", "인증 완료 업체"],
              ["571", "누적 견적 요청"],
              ["43%", "인증 리뷰 작성률"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-3xl font-black text-white">{v}</p>
                <p className="mt-1 text-xs text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-xl font-bold">왜 두바이인테리어인가</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            ["📊", "정량 지표 공개", "허위 리뷰 대신 공기 준수율·추가 비용 청구율·승인 처리 속도를 숫자로 비교합니다. UAE 명예훼손법에 안전한 설계입니다."],
            ["🛡️", "DET 라이선스 검증", "무역 라이선스와 DET 피트아웃 라이선스를 검증한 업체만 '인증' 배지를 받습니다. 만료 시 자동 비활성화됩니다."],
            ["🏗️", "에스크로 + 전문 감리", "공사 대금은 에스크로에 예치되고, 마일스톤별 감리 통과 시에만 업체로 송금됩니다. 선금 먹튀를 구조적으로 차단합니다."],
          ].map(([icon, title, desc]) => (
            <Card key={title}>
              <span className="text-2xl">{icon}</span>
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured companies */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">추천 인증 업체</h2>
          <Link href="/companies" className="text-sm font-semibold text-emerald-600 hover:underline">
            전체 보기 →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {featured.map((c, i) => (
            <Link key={c.id} href={`/companies/${c.id}`}>
              <Card className="transition hover:shadow-md">
                <Placeholder label={c.nameEn} hue={190 + i * 35} />
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="font-bold">{c.name}</h3>
                  <Badge tone="green">인증</Badge>
                  {c.exposurePackage === "premium" && <Badge tone="amber">프리미엄</Badge>}
                </div>
                <p className="mt-1 text-xs text-gray-400">{c.area} · {c.priceRange}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-50 pt-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-emerald-600"><MetricValue value={c.scheduleComplianceRate} suffix="%" /></p>
                    <p className="text-[10px] text-gray-400">공기 준수율</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900"><MetricValue value={c.noExtraChargeRate} suffix="%" /></p>
                    <p className="text-[10px] text-gray-400">추가비용 미청구</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{fmt(c.verifiedReviewCount)}</p>
                    <p className="text-[10px] text-gray-400">인증 리뷰</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Supplier CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-gradient-to-r from-sky-600 to-slate-900 p-10 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">인테리어 업체이신가요?</h2>
            <p className="mt-2 text-sm text-sky-100">
              이미 귀사의 프로필이 등록되어 있을 수 있습니다. 소유권을 주장하고 무료로 포트폴리오를 관리하세요.
            </p>
          </div>
          <Link href="/supplier/license" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-sky-50">
            소유권 주장(Claim) 시작 →
          </Link>
        </div>
      </section>
    </div>
  );
}
