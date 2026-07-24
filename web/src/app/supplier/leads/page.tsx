"use client";

import { useState } from "react";
import { supplierLeads, type Lead } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

const statusTone: Record<Lead["status"], "blue" | "green" | "red" | "gray"> = {
  New: "blue", Accepted: "green", Declined: "red", Expired: "gray",
};

export default function SupplierLeads() {
  const [leads, setLeads] = useState(supplierLeads);

  const act = (id: string, status: Lead["status"]) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        title="Incoming Quote Requests"
        desc="A per-lead fee is charged when you accept. Declined or unanswered leads (24h) are passed to the next-ranked contractor automatically."
      />
      <Notice tone="amber">
        Unpaid fees suspend lead delivery. Billed this month: <b>AED 1,450</b> · settlement Aug 1
      </Notice>

      <div className="mt-6 space-y-4">
        {leads.map((l) => (
          <Card key={l.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{l.spaceType} · {l.area}</p>
                  <Badge tone={statusTone[l.status]}>{l.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-400">{l.consumer} · Budget {l.budget} · Received {l.receivedAt}</p>
                <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{l.wish}</p>
              </div>
              <div className="w-44 text-right">
                <p className="text-xs text-gray-400">Lead fee</p>
                <p className="text-lg font-black">AED {l.fee}</p>
                {l.status === "New" && (
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => act(l.id, "Declined")} className="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-500 hover:border-gray-400">Decline</button>
                    <button onClick={() => act(l.id, "Accepted")} className="flex-1 rounded-lg bg-terracotta py-2 text-xs font-bold text-cream hover:bg-terracotta-deep">Accept</button>
                  </div>
                )}
                {l.status === "Accepted" && <p className="mt-2 text-xs text-emerald-600">✓ Homeowner notified<br />Submit your quotation within 7 days</p>}
                {l.status === "Declined" && <p className="mt-2 text-xs text-gray-400">Passed to next contractor</p>}
              </div>
            </div>
            {l.status === "Accepted" && (
              <button className="mt-4 w-full rounded-xl bg-walnut py-3 text-sm font-bold text-cream hover:bg-walnut-deep">Write &amp; submit quotation →</button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
