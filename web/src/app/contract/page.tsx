"use client";

import { useState } from "react";
import Link from "next/link";
import { contract, fmt } from "@/lib/data";
import { Badge, Card, Notice, Steps } from "@/components/ui";

export default function ContractSign() {
  const [signed, setSigned] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Steps items={["Compare quotes", "Confirm contractor", "Sign contract", "Escrow deposit"]} current={2} />

      <Card>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Milestone Contract Signing</h1>
          <Badge tone="blue">Standard contract v2.1</Badge>
        </div>

        <div className="mt-6 rounded-xl border border-gray-100 p-5 text-sm">
          <p className="font-bold">Construction Contract (Summary)</p>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between"><dt className="text-gray-400">Client</dt><dd>{contract.consumer}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Contractor</dt><dd>Al Noor Interiors (Al Noor Interiors LLC)</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Total amount</dt><dd className="font-bold">AED {fmt(contract.totalAmount)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Duration</dt><dd>{contract.startDate} ~ {contract.endDate}</dd></div>
          </dl>
        </div>

        <h2 className="mt-6 mb-3 text-sm font-bold">Payment ratio per milestone</h2>
        <div className="space-y-2">
          {contract.milestones.map((m, i) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <span><b className="mr-2 text-gray-400">M{i + 1}</b>{m.name}</span>
              <span className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{m.dueDate}</span>
                <b>{m.ratio}%</b>
                <span className="text-xs text-gray-400">AED {fmt((contract.totalAmount * m.ratio) / 100)}</span>
              </span>
            </div>
          ))}
        </div>

        <Notice tone="amber">
          After the contract is finalized, milestone schedule changes require both parties&apos; consent plus operator approval. Each milestone payment is released from escrow only after the QA inspection passes.
        </Notice>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className={`rounded-xl border-2 p-4 text-center ${signed ? "border-terracotta bg-terracotta-tint" : "border-dashed border-gray-300"}`}>
            <p className="text-xs text-gray-400">Client signature</p>
            {signed ? (
              <p className="mt-2 font-serif text-lg italic text-emerald-700">Kim ✓</p>
            ) : (
              <button onClick={() => setSigned(true)} className="mt-2 rounded-lg bg-walnut px-4 py-2 text-xs font-bold text-cream">
                E-sign now
              </button>
            )}
          </div>
          <div className="rounded-xl border-2 border-terracotta bg-terracotta-tint p-4 text-center">
            <p className="text-xs text-gray-400">Contractor signature</p>
            <p className="mt-2 font-serif text-lg italic text-emerald-700">AlNoor ✓</p>
            <p className="text-[10px] text-gray-400">Signed 2026-07-24 14:02</p>
          </div>
        </div>

        {signed ? (
          <Link href="/contract/escrow" className="mt-6 block w-full rounded-xl bg-terracotta py-4 text-center text-sm font-bold text-cream hover:bg-terracotta-deep">
            Signed — proceed to escrow deposit →
          </Link>
        ) : (
          <p className="mt-6 text-center text-xs text-gray-400">Once both parties sign, the contract is finalized and a PDF download becomes available.</p>
        )}
      </Card>
    </div>
  );
}
