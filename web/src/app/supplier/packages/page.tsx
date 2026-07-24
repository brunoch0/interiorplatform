import { exposurePackages } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

export default function Packages() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        title="노출 패키지 구매"
        desc="구매 즉시 혜택이 활성화되며, 만료 시 자동 갱신 없이 일반 노출 순위로 복귀합니다."
      />
      <Notice tone="blue">
        현재 적용 중: <b>프리미엄 노출</b> (2026-07-15 ~ 08-15). 만료 3일 전과 당일에 알림을 보내드립니다.
      </Notice>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {exposurePackages.map((p, i) => (
          <Card key={p.id} className={i === 1 ? "ring-2 ring-amber-400" : ""}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{p.name}</h2>
              {i === 1 && <Badge tone="amber">적용 중</Badge>}
            </div>
            <p className="mt-3 text-3xl font-black">
              <span className="text-sm font-semibold text-gray-400">AED </span>{p.price}
              <span className="text-sm font-normal text-gray-400"> / {p.period}</span>
            </p>
            <ul className="mt-4 space-y-2 border-t border-gray-50 pt-4 text-sm text-gray-600">
              {p.benefits.map((b) => <li key={b}>✓ {b}</li>)}
            </ul>
            <button
              className={`mt-5 w-full rounded-xl py-3 text-sm font-bold ${
                i === 1 ? "bg-gray-100 text-gray-400" : "bg-slate-900 text-white hover:bg-slate-700"
              }`}
              disabled={i === 1}
            >
              {i === 1 ? "만료 후 재구매 가능" : "구매하기"}
            </button>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-xs text-gray-400">
        구매 전 노출 위치와 기간이 명시되며, 환불 정책은 운영 정책에 따릅니다. 유료 노출은 &lsquo;광고&rsquo; 표기와 함께 노출되며 정량 신뢰 지표에는 영향을 주지 않습니다.
      </p>
    </div>
  );
}
