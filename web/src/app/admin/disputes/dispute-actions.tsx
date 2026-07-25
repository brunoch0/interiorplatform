"use client";

import { useState, useTransition } from "react";
import { updateDispute } from "./actions";

const NEXT_STATUSES = ["mediating", "resolved", "escalated", "closed"];

export default function DisputeActions({ adminKey, id, status: initial }: { adminKey: string; id: string; status: string }) {
  const [status, setStatus] = useState(initial);
  const [notes, setNotes] = useState("");
  const [, startTransition] = useTransition();

  const set = (next: string) => {
    setStatus(next);
    startTransition(async () => {
      await updateDispute(adminKey, id, next, notes || null);
    });
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {NEXT_STATUSES.filter((s) => s !== status).map((s) => (
        <button key={s} onClick={() => set(s)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:border-gray-400">
          → {s}
        </button>
      ))}
      <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal note (saved with next status change)"
        className="w-72 rounded-lg border border-gray-200 px-3 py-2 text-xs" />
    </div>
  );
}
