"use client";

import { useState } from "react";
import Link from "next/link";
import { qaChecklist, type ChecklistItem } from "@/lib/data";
import { BackLink, Card, Notice, PageHeader } from "@/components/ui";

export default function ChecklistInput() {
  const [items, setItems] = useState<ChecklistItem[]>(qaChecklist);
  const [savedAt, setSavedAt] = useState<string | null>("Auto-saved at 15:42");

  const setResult = (id: string, result: "Pass" | "Fail") => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, result } : it)));
    setSavedAt("Auto-saved just now");
  };

  const incomplete = items.filter((it) => it.required && it.result === null);
  const canSubmit = incomplete.length === 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <BackLink href="/project" label="Back to project" />
      <PageHeader title="On-site Inspection Checklist" desc="M2. Electrical & Plumbing · Inspector-only input screen (Inspector: J. Chung)" />

      <Notice tone="blue">{savedAt} — Data is saved locally even if the network drops, and stays hidden from the homeowner and contractor until submitted.</Notice>

      <div className="mt-6 space-y-4">
        {items.map((it) => (
          <Card key={it.id} className={it.required && it.result === null ? "ring-2 ring-amber-300" : ""}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {it.label} {it.required && <span className="text-xs text-red-500">*required</span>}
                </p>
                {it.comment && <p className="mt-1 text-xs text-gray-400">{it.comment}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setResult(it.id, "Pass")}
                  className={`rounded-lg px-4 py-2 text-xs font-bold ${it.result === "Pass" ? "bg-terracotta text-cream" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  Pass
                </button>
                <button
                  onClick={() => setResult(it.id, "Fail")}
                  className={`rounded-lg px-4 py-2 text-xs font-bold ${it.result === "Fail" ? "bg-red-500 text-cream" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  Fail
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-gray-50 pt-3 text-xs text-gray-400">
              <span>Photos {it.photos}/5</span>
              <button className="rounded border border-dashed border-gray-300 px-2 py-1 hover:border-gray-400">+ Add photo (JPG·PNG)</button>
              <input className="ml-auto w-40 rounded border border-gray-200 px-2 py-1" placeholder="Item comment" defaultValue={it.comment} />
            </div>
          </Card>
        ))}
      </div>

      {!canSubmit && (
        <p className="mt-5 text-center text-sm text-amber-600">{incomplete.length} required item(s) missing. Submission is enabled once all required items are filled in.</p>
      )}
      <Link
        href={canSubmit ? "/project/qa-report" : "#"}
        aria-disabled={!canSubmit}
        className={`mt-4 block w-full rounded-xl py-4 text-center text-sm font-bold ${
          canSubmit ? "bg-walnut text-cream hover:bg-walnut-deep" : "pointer-events-none bg-gray-200 text-gray-400"
        }`}
      >
        Submit checklist → auto-generate QA report
      </Link>
    </div>
  );
}
