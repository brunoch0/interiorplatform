import Link from "next/link";
import { BackLink, Card, Notice, Steps } from "@/components/ui";

export default function SupplierSignup() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <BackLink href="/onboarding" label="역할 선택으로" />
      <h1 className="text-2xl font-bold">공급자 회원가입</h1>
      <p className="mt-2 mb-8 text-sm text-gray-500">DET 정식 라이선스를 보유한 인테리어·피트아웃 업체만 인증받을 수 있습니다.</p>
      <Steps items={["담당자 정보", "업체 매칭", "라이선스 인증"]} current={0} />
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">담당자 이름</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="담당자 실명" />
          </div>
          <div>
            <label className="text-sm font-medium">업체명 (영문)</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="예: Al Noor Interiors LLC" />
            <p className="mt-1.5 text-xs text-gray-400">입력한 업체명으로 기존 등록 프로필을 검색해 소유권 주장(Claim)으로 연결합니다.</p>
          </div>
          <div>
            <label className="text-sm font-medium">업무용 이메일</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="contact@company.ae" />
          </div>
          <div>
            <label className="text-sm font-medium">연락처</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="+971 4 000 0000" />
          </div>
          <Notice>
            등록되지 않은 업체는 신규 프로필로 생성됩니다. 무역 라이선스 + DET 피트아웃 라이선스 서류를 미리 준비해 주세요 (PDF/JPG).
          </Notice>
          <Link href="/supplier/license" className="block w-full rounded-xl bg-sky-600 py-3.5 text-center text-sm font-bold text-white transition hover:bg-sky-700">
            업체 매칭 확인 →
          </Link>
        </div>
      </Card>
    </div>
  );
}
