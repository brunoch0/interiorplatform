"use client";

import { useState } from "react";
import Link from "next/link";
import { contract, fmt } from "@/lib/data";
import { Card, Notice, Steps } from "@/components/ui";

export default function EscrowDeposit() {
  const [deposited, setDeposited] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Steps items={["Compare quotes", "Confirm contractor", "Sign contract", "Escrow deposit"]} current={3} />

      <Card>
        <h1 className="text-xl font-bold">Escrow Deposit</h1>
        <p className="mt-1 text-sm text-gray-500">
          Deposit the full contract amount into the platform&apos;s escrow account. Construction start approval activates once the deposit is confirmed.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-xs text-slate-400">Deposit amount (contract total)</p>
          <p className="mt-1 text-4xl font-black">AED {fmt(contract.totalAmount)}</p>
          <div className="mt-4 flex items-center justify-between border-t border-slate-700 pt-4 text-xs text-slate-300">
            <span>Escrow account: DIP-ESCROW-****4821</span>
            <span>CBUAE-compliant structure</span>
          </div>
        </div>

        <h2 className="mt-6 mb-3 text-sm font-bold">Payment method</h2>
        <div className="space-y-2">
          {[
            ["UAE bank transfer", "No fee · confirmed within 1 business day", true],
            ["Credit card (Visa/Master)", "2.5% fee · instant confirmation", false],
          ].map(([label, desc, def]) => (
            <label key={label as string} className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-50">
              <span className="flex items-center gap-3">
                <input type="radio" name="pay" defaultChecked={def as boolean} className="accent-emerald-500" />
                <span className="font-medium">{label}</span>
              </span>
              <span className="text-xs text-gray-400">{desc}</span>
            </label>
          ))}
        </div>

        <Notice tone="blue">
          Funds are released to the contractor only when each milestone&apos;s QA report is issued as &lsquo;Pass&rsquo; (within 48 hours). If a dispute is filed, that milestone&apos;s payment is automatically held.
        </Notice>

        {deposited ? (
          <div className="mt-6 rounded-xl bg-emerald-50 p-6 text-center">
            <p className="text-lg font-bold text-emerald-700">✓ Deposit confirmed</p>
            <p className="mt-1 text-sm text-emerald-600">The contractor has been notified. Construction start approval is now active.</p>
            <Link href="/project" className="mt-4 inline-block rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-slate-700">
              Go to project management →
            </Link>
          </div>
        ) : (
          <button onClick={() => setDeposited(true)} className="mt-6 w-full rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white hover:bg-emerald-600">
            Deposit AED {fmt(contract.totalAmount)} into escrow
          </button>
        )}
      </Card>
    </div>
  );
}
