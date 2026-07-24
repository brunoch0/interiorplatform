import { Badge, Card, FileDrop, Notice, PageHeader, Placeholder } from "@/components/ui";

export default function SupplierProfile() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        title="프로필 / 포트폴리오 관리"
        desc="등록 콘텐츠는 운영자 모더레이션 승인 후 공개 프로필에 노출됩니다."
        action={<button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700">변경사항 저장</button>}
      />

      <Card className="mb-6">
        <h2 className="mb-4 font-bold">기본 정보</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">전문 분야</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["풀 리노베이션", "주방", "욕실", "상업 공간", "스마트홈"].map((c, i) => (
                <label key={c} className="cursor-pointer rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 has-[:checked]:text-sky-700">
                  <input type="checkbox" className="hidden" defaultChecked={i < 3} /> {c}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">평균 견적 가격대</label>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <input className="w-32 rounded-xl border border-gray-200 px-4 py-2.5" defaultValue="AED 80,000" />
              <span className="text-gray-400">~</span>
              <input className="w-32 rounded-xl border border-gray-200 px-4 py-2.5" defaultValue="AED 250,000" />
            </div>
            <label className="mt-4 block text-sm font-medium">시공 가능 지역</label>
            <input className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" defaultValue="Dubai 전역 (Business Bay 기반)" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium">서비스 소개 <span className="text-xs text-gray-400">(1,000자 이내)</span></label>
          <textarea rows={3} maxLength={1000} className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" defaultValue="두바이 15년 경력, DM 승인 전담팀 보유. 한국어 상담 가능한 프리미엄 피트아웃 전문사입니다." />
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">포트폴리오 이미지 <span className="ml-1 text-xs font-normal text-gray-400">42/50장</span></h2>
          <span className="text-xs text-gray-400">JPG·PNG · 장당 최대 10MB · 드래그로 순서 변경</span>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
          <div className="relative">
            <Placeholder label="대표" hue={200} />
            <Badge tone="navy">대표 이미지</Badge>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative">
              <Placeholder label={i % 2 ? "AFTER" : "BEFORE"} hue={180 + i * 25} />
              <Badge tone="green">승인됨</Badge>
            </div>
          ))}
          {[4, 5, 6].map((i) => (
            <div key={i} className="relative opacity-70">
              <Placeholder label="심사 중" hue={40} />
              <Badge tone="amber">모더레이션 대기</Badge>
            </div>
          ))}
          <FileDrop label="이미지 추가" hint="비포&애프터 권장" />
        </div>
        <Notice tone="blue">모더레이션 대기 이미지는 승인 전까지 공개 프로필에 노출되지 않습니다.</Notice>
      </Card>
    </div>
  );
}
