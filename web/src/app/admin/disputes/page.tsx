"use client";

import { useState } from "react";
import { disputes as seed, fmt, type Dispute } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>(seed);
  const [amount, setAmount] = useState("");

  const resolve = (id: string, resolution: string) =>
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: "Resolved", resolution } : d)));

  return (
    <div>
      <PageHeader title="Dispute Mediation Dashboard" desc="Filed disputes auto-hold that milestone's payment. Decisions are sent to both parties simultaneously." />

      <div className="space-y-5">
        {disputes.map((d) => (
          <Card key={d.id} className={d.status !== "Resolved" ? "ring-1 ring-red-200" : ""}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold">{d.id.toUpperCase()} · {d.milestone}</p>
              <Badge tone={d.status === "Resolved" ? "green" : "red"}>{d.status}</Badge>
              <Badge tone="gray">Claimant: {d.claimant}</Badge>
              <span className="ml-auto text-xs text-gray-400">Filed {d.filedAt}</span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="text-xs text-gray-400">Parties</p>
                <p className="mt-1">{d.consumer} ↔ {d.companyName}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="text-xs text-gray-400">Payment on hold</p>
                <p className="mt-1 font-bold text-red-600">AED {fmt(d.amount)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="text-xs text-gray-400">Evidence</p>
                <p className="mt-1">{d.evidenceCount} items <button className="ml-1 text-xs text-sky-600 underline">View all</button></p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600"><b className="text-gray-400">Reason:</b> {d.reason}</p>

            {d.status === "Resolved" ? (
              <Notice tone="green">Decision: {d.resolution} — both parties notified. The process and outcome are archived.</Notice>
            ) : (
              <div className="mt-4 rounded-xl border border-gray-100 p-4">
                <p className="text-sm font-bold">Mediation decision</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button onClick={() => resolve(d.id, "Hold released — full payment to contractor")} className="rounded-lg bg-terracotta px-4 py-2.5 text-xs font-bold text-cream hover:bg-terracotta-deep">
                    Release (pay contractor)
                  </button>
                  <button onClick={() => resolve(d.id, "Full refund to consumer")} className="rounded-lg bg-red-500 px-4 py-2.5 text-xs font-bold text-cream hover:bg-red-600">
                    Refund (consumer)
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Partial amount (AED)"
                      className="w-40 rounded-lg border border-gray-200 px-3 py-2.5 text-xs"
                    />
                    <button
                      onClick={() => resolve(d.id, `Partial settlement — AED ${amount || "0"} to contractor, remainder refunded`)}
                      className="rounded-lg bg-walnut px-4 py-2.5 text-xs font-bold text-cream hover:bg-walnut-deep"
                    >
                      Execute partial settlement
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-400">Payments for other milestones in the same contract are unaffected by this dispute.</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
