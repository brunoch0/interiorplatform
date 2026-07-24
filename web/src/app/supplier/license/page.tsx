"use client";

import { useState } from "react";
import { Card, FileDrop, Notice, PageHeader, Steps } from "@/components/ui";

export default function LicenseUpload() {
  const [step, setStep] = useState(0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader
        title="Claim Your Profile — License Verification"
        desc="Simplified 3-step onboarding. After operator approval, profile ownership transfers to you and portfolio registration unlocks."
      />
      <Steps items={["Confirm basic info", "Trade license", "DET license"]} current={step} />

      {step === 0 && (
        <Card>
          <h2 className="font-bold">Step 1 — Confirm profile details</h2>
          <p className="mt-1 text-sm text-gray-500">Please confirm the listed information matches your company.</p>
          <dl className="mt-5 space-y-3 rounded-xl bg-gray-50 p-5 text-sm">
            <div className="flex justify-between"><dt className="text-gray-400">Company</dt><dd className="font-semibold">Gulf Craft Contracting</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Area</dt><dd>Al Quoz</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Phone</dt><dd>+971 4 3XX XXXX</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Categories</dt><dd>Carpentry · Painting</dd></div>
          </dl>
          <Notice tone="blue">This is an auto-generated &lsquo;Unclaimed&rsquo; profile built from public information. You can request corrections during review if anything is wrong.</Notice>
          <button onClick={() => setStep(1)} className="mt-5 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-slate-700">
            Details are correct — continue →
          </button>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <h2 className="font-bold">Step 2 — Upload trade license</h2>
          <p className="mt-1 text-sm text-gray-500">Upload a copy of your valid trade license.</p>
          <div className="mt-5">
            <FileDrop label="Upload trade license" hint="PDF, JPG · max 10MB" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">License number</label>
              <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="e.g. 887123" />
            </div>
            <div>
              <label className="text-sm font-medium">Expiry date</label>
              <input type="date" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </div>
          </div>
          <button onClick={() => setStep(2)} className="mt-5 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-slate-700">
            Uploaded — continue →
          </button>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <h2 className="font-bold">Step 3 — Upload DET interior/fit-out license</h2>
          <p className="mt-1 text-sm text-gray-500">Upload your official DET interior/fit-out activity license. Validity is checked against DET records.</p>
          <div className="mt-5">
            <FileDrop label="Upload DET license" hint="PDF, JPG · max 10MB" />
          </div>
          <Notice>
            Operator review takes 1–2 business days. On approval: ownership transfer + portfolio unlock. On rejection: the reason and resubmission guide arrive via push notification.
          </Notice>
          <button onClick={() => setStep(3)} className="mt-5 w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white hover:bg-emerald-600">
            Submit for review
          </button>
        </Card>
      )}

      {step === 3 && (
        <Card className="text-center">
          <span className="text-5xl">✅</span>
          <h2 className="mt-4 text-xl font-bold">Submitted for review</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
            Reference <b>CLM-2026-0724-18</b> · You&apos;ll get the result via push notification. If you leave mid-way, a reminder will help you pick up where you left off.
          </p>
        </Card>
      )}
    </div>
  );
}
