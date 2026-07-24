import { Badge, Card, Notice, PageHeader } from "@/components/ui";

const flagged = [
  {
    id: "f1",
    company: "데저트 오크 디자인",
    author: "익명 사용자",
    date: "2026-07-22",
    excerpt: "이 회사는 완전 사기꾼입니다. 절대 쓰지 마세요...",
    reason: "감정적 비방 표현 — UAE 명예훼손법 위반 가능성 (자동 키워드 탐지)",
    risk: "높음",
  },
  {
    id: "f2",
    company: "마리나 피트아웃",
    author: "김○○",
    date: "2026-07-20",
    excerpt: "담당자 이름 ○○○, 전화번호 05X-XXX-XXXX로 연락했으나...",
    reason: "개인정보(실명·연락처) 포함 — 마스킹 필요",
    risk: "중간",
  },
];

export default function AdminReviews() {
  return (
    <div>
      <PageHeader
        title="리뷰 및 평판 모니터링"
        desc="키워드 필터링·반복 패턴 인식으로 자동 탐지된 콘텐츠를 검토합니다."
        action={
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">CSV 내보내기</button>
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">컴플라이언스 보고서 (PDF)</button>
          </div>
        }
      />
      <Notice tone="red">
        자동 탐지 대기 2건 — UAE 명예훼손법 컴플라이언스 기준에 따라 게시 보류 상태입니다. 검토 후 삭제·수정·게시를 결정하세요.
      </Notice>

      <div className="mt-6 space-y-4">
        {flagged.map((f) => (
          <Card key={f.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold">{f.company}</p>
                  <Badge tone={f.risk === "높음" ? "red" : "amber"}>위험도 {f.risk}</Badge>
                  <Badge tone="gray">게시 보류 중</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-400">{f.author} · {f.date}</p>
                <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm italic text-gray-500">&ldquo;{f.excerpt}&rdquo;</p>
                <p className="mt-2 text-xs text-red-500">탐지 사유: {f.reason}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="rounded-lg bg-red-500 px-5 py-2 text-sm font-bold text-white hover:bg-red-600">삭제</button>
                <button className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-500 hover:border-gray-400">수정 요청</button>
                <button className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-500 hover:border-gray-400">게시 허용</button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="mb-4 font-bold">모니터링 통계 (이번 달)</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-center">
          {[
            ["87", "신규 인증 리뷰"],
            ["5", "자동 탐지"],
            ["2", "삭제 처리"],
            ["1", "블랙리스트 경고"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl bg-gray-50 p-4">
              <p className="text-2xl font-black">{v}</p>
              <p className="mt-1 text-xs text-gray-400">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">
          평판 기준 미달 업체는 자동 목록 하단 배치되며, 누적 기준 위반 시 블랙리스트 처리 알림이 발송됩니다. 정기 보고서는 매월 1일 자동 생성·발송됩니다.
        </p>
      </Card>
    </div>
  );
}
