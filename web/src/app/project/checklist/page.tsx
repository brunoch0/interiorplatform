"use client";

import { useState } from "react";
import Link from "next/link";
import { qaChecklist, type ChecklistItem } from "@/lib/data";
import { BackLink, Badge, Card, Notice, PageHeader } from "@/components/ui";

export default function ChecklistInput() {
  const [items, setItems] = useState<ChecklistItem[]>(qaChecklist);
  const [savedAt, setSavedAt] = useState<string | null>("15:42 자동 임시 저장됨");

  const setResult = (id: string, result: "통과" | "미통과") => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, result } : it)));
    setSavedAt("방금 자동 임시 저장됨");
  };

  const incomplete = items.filter((it) => it.required && it.result === null);
  const canSubmit = incomplete.length === 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <BackLink href="/project" label="공사 진행 관리로" />
      <PageHeader title="현장 방문 체크리스트" desc="M2. 전기·배관 공사 · 감리단 전용 입력 화면 (감리: 정감리)" />

      <Notice tone="blue">💾 {savedAt} — 네트워크가 끊겨도 기기에 임시 저장되며, 제출 전까지 소비자·업체에게 공개되지 않습니다.</Notice>

      <div className="mt-6 space-y-4">
        {items.map((it) => (
          <Card key={it.id} className={it.required && it.result === null ? "ring-2 ring-amber-300" : ""}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {it.label} {it.required && <span className="text-xs text-red-500">*필수</span>}
                </p>
                {it.comment && <p className="mt-1 text-xs text-gray-400">{it.comment}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setResult(it.id, "통과")}
                  className={`rounded-lg px-4 py-2 text-xs font-bold ${it.result === "통과" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  통과
                </button>
                <button
                  onClick={() => setResult(it.id, "미통과")}
                  className={`rounded-lg px-4 py-2 text-xs font-bold ${it.result === "미통과" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  미통과
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-gray-50 pt-3 text-xs text-gray-400">
              <span>📷 사진 증빙 {it.photos}/5</span>
              <button className="rounded border border-dashed border-gray-300 px-2 py-1 hover:border-gray-400">+ 사진 추가 (JPG·PNG)</button>
              <input className="ml-auto w-40 rounded border border-gray-200 px-2 py-1" placeholder="항목 코멘트" defaultValue={it.comment} />
            </div>
          </Card>
        ))}
      </div>

      {!canSubmit && (
        <p className="mt-5 text-center text-sm text-amber-600">필수 항목 {incomplete.length}건이 미입력 상태입니다. 모든 필수 항목 입력 후 제출할 수 있습니다.</p>
      )}
      <Link
        href={canSubmit ? "/project/qa-report" : "#"}
        aria-disabled={!canSubmit}
        className={`mt-4 block w-full rounded-xl py-4 text-center text-sm font-bold ${
          canSubmit ? "bg-slate-900 text-white hover:bg-slate-700" : "pointer-events-none bg-gray-200 text-gray-400"
        }`}
      >
        체크리스트 제출 → QA 리포트 자동 생성
      </Link>
    </div>
  );
}
