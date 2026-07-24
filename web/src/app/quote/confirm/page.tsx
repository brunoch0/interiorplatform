import Link from "next/link";
import { fmt } from "@/lib/data";
import { BackLink, Card, Notice, Steps } from "@/components/ui";

export default function QuoteConfirm() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <BackLink href="/quote/compare" label="견적 비교로" />
      <Steps items={["견적 비교", "업체 확정", "계약 서명", "에스크로 예치"]} current={1} />

      <Card>
        <h1 className="text-xl font-bold">업체 선택 확정</h1>
        <p className="mt-1 text-sm text-gray-500">아래 내용으로 계약 절차를 시작합니다.</p>

        <div className="mt-6 rounded-xl bg-gray-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">알누르 인테리어</p>
              <p className="text-xs text-gray-400">Al Noor Interiors LLC · Business Bay</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">AED {fmt(145000)}</p>
              <p className="text-xs text-gray-400">예상 공기 12주</p>
            </div>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-gray-400">공사 범위</dt><dd className="font-medium">아파트 3BR 풀 리노베이션 (주방 확장, 욕실 2개)</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">착공 예정</dt><dd className="font-medium">2026-08-10</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">DM 승인 대행</dt><dd className="font-medium">포함</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">결제 방식</dt><dd className="font-medium text-emerald-600">에스크로 (마일스톤 4단계)</dd></div>
        </dl>

        <Notice tone="blue">
          확정 시 나머지 업체에는 자동으로 정중한 거절 알림이 발송됩니다. 확정 후 계약서 초안이 생성되며, 양측 전자 서명 전까지 법적 효력이 없습니다.
        </Notice>

        <Link href="/contract" className="mt-6 block w-full rounded-xl bg-emerald-500 py-4 text-center text-sm font-bold text-white hover:bg-emerald-600">
          확정하고 계약서 작성으로 →
        </Link>
      </Card>
    </div>
  );
}
