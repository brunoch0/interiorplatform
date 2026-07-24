"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
import { contract, fmt } from "@/lib/data";
import { BackLink, Card, FileDrop, Notice, PageHeader } from "@/components/ui";

export default function DisputeFile() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50"><Scale className="h-7 w-7 text-red-600" strokeWidth={1.75} /></span>
        <h1 className="mt-4 text-2xl font-bold">Dispute filed</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
          Case No. <b>DSP-2026-0724-01</b> · The escrow payment for milestone M2 (<b>AED {fmt(36250)}</b>) has been automatically held
          and the operator mediation process has started. Payments for other milestones are not affected.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <BackLink href="/project" label="Back to project" />
      <PageHeader title="File a Dispute" desc="Filing immediately holds that milestone's escrow payment and starts operator mediation." />

      <Card>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium">Target milestone</label>
            <select className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              {contract.milestones.map((m, i) => (
                <option key={m.id}>M{i + 1}. {m.name} (payment AED {fmt((contract.totalAmount * m.ratio) / 100)})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Dispute type</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Wrong materials", "Workmanship defect", "Schedule delay", "Unauthorized extra charge", "Other"].map((t) => (
                <label key={t} className="cursor-pointer rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 has-[:checked]:border-red-400 has-[:checked]:bg-red-50 has-[:checked]:text-red-600">
                  <input type="radio" name="type" className="hidden" /> {t}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Reason (state facts only)</label>
            <textarea
              rows={5}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              placeholder="e.g. On Jul 20 I confirmed on site that the installed switches differ from the brand (Legrand) specified in contract annex 2."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Attach evidence</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <FileDrop label="Photo evidence" hint="JPG, PNG · up to 10" />
              <FileDrop label="Documents" hint="Contract, quotation etc. (PDF)" />
            </div>
          </div>
          <Notice tone="amber">
            To prevent abuse, confirmed false claims may result in account restrictions. The operator reviews both parties&apos; evidence and decides whether to release or refund the held payment.
          </Notice>
          <button onClick={() => setSubmitted(true)} className="w-full rounded-xl bg-red-500 py-4 text-sm font-bold text-cream hover:bg-red-600">
            File dispute &amp; hold payment
          </button>
        </div>
      </Card>
    </div>
  );
}
