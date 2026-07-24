import Link from "next/link";
import { BackLink, Card, Notice, Steps } from "@/components/ui";

export default function ConsumerSignup() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <BackLink href="/onboarding" label="역할 선택으로" />
      <h1 className="text-2xl font-bold">소비자 회원가입</h1>
      <p className="mt-2 mb-8 text-sm text-gray-500">두바이 거주 여부와 관계없이 가입할 수 있습니다.</p>
      <Steps items={["기본 정보", "연락처 인증", "완료"]} current={0} />
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">이름</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="실명을 입력하세요" />
          </div>
          <div>
            <label className="text-sm font-medium">이메일</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium">휴대폰 번호 (UAE / 해외)</label>
            <div className="mt-1.5 flex gap-2">
              <select className="rounded-xl border border-gray-200 px-3 py-3 text-sm">
                <option>+971</option>
                <option>+82</option>
              </select>
              <input className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="50 123 4567" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">관심 공간 유형</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["아파트", "빌라", "상업 공간", "아직 미정"].map((t) => (
                <label key={t} className="cursor-pointer rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-700">
                  <input type="checkbox" className="hidden" /> {t}
                </label>
              ))}
            </div>
          </div>
          <Notice tone="blue">가입 시 실명 확인이 진행되며, 인증 리뷰 작성 시 공사 완료 증빙이 요구됩니다.</Notice>
          <Link href="/companies" className="block w-full rounded-xl bg-slate-900 py-3.5 text-center text-sm font-bold text-white transition hover:bg-slate-700">
            다음 단계 →
          </Link>
        </div>
      </Card>
    </div>
  );
}
