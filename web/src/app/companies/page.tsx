"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { areas, budgetOptions, categoryOptions, companies, fmt, spaceTypeOptions } from "@/lib/data";
import { Badge, Card, MetricValue, PageHeader, Placeholder } from "@/components/ui";

export default function CompaniesPage() {
  const [space, setSpace] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = companies.filter((c) => {
      if (space && !c.spaceTypes.includes(space)) return false;
      if (area && c.area !== area) return false;
      if (category && !c.categories.includes(category)) return false;
      return true;
    });
    // 정량 신뢰 지표 기본 정렬: 인증 우선 → 프리미엄 → 공기 준수율
    list = [...list].sort((a, b) => {
      if (a.verified !== b.verified) return a.verified ? -1 : 1;
      const pa = a.exposurePackage === "premium" ? 1 : 0;
      const pb = b.exposurePackage === "premium" ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return (b.scheduleComplianceRate ?? -1) - (a.scheduleComplianceRate ?? -1);
    });
    return list;
  }, [space, area, category]);

  const similar = useMemo(
    () => (filtered.length === 0 ? companies.filter((c) => c.verified).slice(0, 3) : []),
    [filtered]
  );

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 5 ? [...s, id] : s));

  const reset = () => {
    setSpace(null);
    setArea(null);
    setBudget(null);
    setCategory(null);
  };

  const FilterGroup = ({ label, options, value, onChange }: { label: string; options: string[]; value: string | null; onChange: (v: string | null) => void }) => (
    <div>
      <p className="mb-2 text-xs font-semibold text-gray-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(value === o ? null : o)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              value === o ? "border-slate-900 bg-slate-900 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="업체 검색"
        desc="조건을 조합해 인증 업체를 필터링하세요. 결과는 정량 신뢰 지표 순으로 정렬됩니다."
        action={
          <button onClick={reset} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">
            필터 초기화
          </button>
        }
      />

      <Card className="mb-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <FilterGroup label="공간 유형" options={spaceTypeOptions} value={space} onChange={setSpace} />
          <FilterGroup label="지역" options={areas.slice(0, 6)} value={area} onChange={setArea} />
          <FilterGroup label="예산 범위" options={budgetOptions.slice(1, 5)} value={budget} onChange={setBudget} />
          <FilterGroup label="전문 분야" options={categoryOptions.slice(0, 5)} value={category} onChange={setCategory} />
        </div>
      </Card>

      <p className="mb-4 text-sm text-gray-500">
        총 <b className="text-slate-900">{filtered.length}</b>개 업체
        {selected.length > 0 && <span className="ml-3 text-emerald-600">· 견적 요청 담기 {selected.length}/5</span>}
      </p>

      {filtered.length === 0 && (
        <Card className="mb-8 text-center">
          <p className="font-semibold">조건에 맞는 업체가 없습니다</p>
          <p className="mt-1 text-sm text-gray-500">필터 일부를 해제하고 다시 시도해 보세요. 조건과 가까운 업체를 추천해 드립니다.</p>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {(filtered.length > 0 ? filtered : similar).map((c, i) => (
          <Card key={c.id} className={`relative ${!c.verified ? "opacity-90" : ""}`}>
            <div className="flex gap-4">
              <div className="w-28 shrink-0">
                <Placeholder label="" ratio="aspect-square" hue={c.verified ? 190 + i * 25 : 0} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/companies/${c.id}`} className="font-bold hover:underline">{c.name}</Link>
                  {c.verified ? <Badge tone="green">인증</Badge> : <Badge tone="gray">미인증</Badge>}
                  {c.exposurePackage === "premium" && <Badge tone="amber">프리미엄</Badge>}
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-400">{c.nameEn} · {c.area} · {c.priceRange}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-gray-50 py-2">
                    <p className="text-sm font-bold text-emerald-600"><MetricValue value={c.scheduleComplianceRate} suffix="%" /></p>
                    <p className="text-[10px] text-gray-400">공기 준수율</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 py-2">
                    <p className="text-sm font-bold"><MetricValue value={c.noExtraChargeRate} suffix="%" /></p>
                    <p className="text-[10px] text-gray-400">추가비용 미청구</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 py-2">
                    <p className="text-sm font-bold">{fmt(c.verifiedReviewCount)}</p>
                    <p className="text-[10px] text-gray-400">인증 리뷰</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t border-gray-50 pt-4">
              <Link href={`/companies/${c.id}`} className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-sm font-medium hover:border-gray-400">
                상세 보기
              </Link>
              {c.verified ? (
                <button
                  onClick={() => toggleSelect(c.id)}
                  className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                    selected.includes(c.id) ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-700"
                  }`}
                >
                  {selected.includes(c.id) ? "✓ 담김" : "견적 요청 담기"}
                </button>
              ) : (
                <Link href="/supplier/license" className="flex-1 rounded-lg bg-gray-100 py-2 text-center text-sm font-bold text-gray-500 hover:bg-gray-200">
                  소유권 주장
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white/95 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
            <p className="text-sm">
              <b className="text-emerald-600">{selected.length}개</b> 업체 선택됨 (최대 5개)
            </p>
            <Link href="/quote" className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-600">
              동시 견적 요청하기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
