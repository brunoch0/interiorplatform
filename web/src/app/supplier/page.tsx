import Link from "next/link";
import { fmt, supplierLeads } from "@/lib/data";
import { Badge, Card, PageHeader, Stat } from "@/components/ui";

export default function SupplierDashboard() {
  const newLeads = supplierLeads.filter((l) => l.status === "신규").length;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="공급자 대시보드"
        desc="알누르 인테리어 (Al Noor Interiors LLC) · 인증 완료 · 프리미엄 노출 적용 중"
        action={<Badge tone="green">DET 라이선스 유효 (2027-03-15 만료)</Badge>}
      />

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Stat label="신규 리드" value={`${newLeads}건`} sub="응답 기한 24시간" tone="good" />
        <Stat label="이번 달 프로필 조회" value={fmt(1284)} sub="전월 대비 +32%" tone="good" />
        <Stat label="진행 중 공사" value="3건" sub="에스크로 계약 2건 포함" />
        <Stat label="이번 달 리드 수수료" value={`AED ${fmt(1450)}`} sub="정산 예정일 08-01" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/supplier/profile", icon: "🖼️", title: "프로필/포트폴리오 관리", desc: "시공 사례 42장 등록 · 모더레이션 대기 3장" },
          { href: "/supplier/license", icon: "📜", title: "라이선스 인증", desc: "인증 완료 · 갱신 알림 2027-02-15 예정" },
          { href: "/supplier/leads", icon: "📥", title: "수신 견적 요청", desc: `신규 ${newLeads}건 · 수락 대기 중` },
          { href: "/supplier/packages", icon: "🚀", title: "노출 패키지", desc: "프리미엄 적용 중 · 08-15 만료" },
        ].map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="h-full transition hover:shadow-md">
              <span className="text-2xl">{m.icon}</span>
              <h2 className="mt-3 font-bold">{m.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{m.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <h2 className="mb-4 font-bold">내 정량 신뢰 지표 <span className="ml-2 text-xs font-normal text-gray-400">(인증 리뷰 자동 산출 · 수정 불가)</span></h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["96%", "공기 준수율"],
            ["92%", "추가 비용 미청구율"],
            ["34건", "인증 리뷰"],
            ["2.1주", "정부 승인 평균 소요"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-2xl font-black">{v}</p>
              <p className="mt-1 text-xs text-gray-400">{l}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
