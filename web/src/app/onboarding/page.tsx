import Link from "next/link";
import { Card } from "@/components/ui";

export default function Onboarding() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-black">두바이인테리어 시작하기</h1>
        <p className="mt-3 text-gray-500">어떤 목적으로 이용하시나요? 역할에 맞는 가입 절차로 안내해 드립니다.</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Link href="/signup/consumer">
          <Card className="h-full transition hover:border-emerald-300 hover:shadow-md">
            <span className="text-3xl">🏠</span>
            <h2 className="mt-4 text-lg font-bold">인테리어를 맡기고 싶어요</h2>
            <p className="mt-1 text-sm font-medium text-emerald-600">소비자(건축주) 가입</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>✓ 정량 지표로 인증 업체 비교</li>
              <li>✓ 최대 5개 업체 동시 견적 요청</li>
              <li>✓ 에스크로·감리 리포트로 안전한 공사 관리</li>
            </ul>
          </Card>
        </Link>
        <Link href="/signup/supplier">
          <Card className="h-full transition hover:border-sky-300 hover:shadow-md">
            <span className="text-3xl">🔨</span>
            <h2 className="mt-4 text-lg font-bold">시공 업체입니다</h2>
            <p className="mt-1 text-sm font-medium text-sky-600">공급자(인테리어 업체) 가입</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>✓ 기존 프로필 소유권 주장(Claim)</li>
              <li>✓ 포트폴리오 무료 등록·관리</li>
              <li>✓ 검증된 건축주 리드 수신</li>
            </ul>
          </Card>
        </Link>
      </div>
      <div className="mt-8 rounded-xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
        간편 로그인:{" "}
        <span className="mx-1 inline-block rounded-lg border border-gray-200 px-4 py-2 font-medium text-slate-700">Google</span>
        <span className="mx-1 inline-block rounded-lg border border-gray-200 px-4 py-2 font-medium text-slate-700">Apple</span>
        <span className="mx-1 inline-block rounded-lg border border-gray-200 px-4 py-2 font-medium text-slate-700">이메일</span>
      </div>
    </div>
  );
}
