"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { Card, FileDrop, Notice, PageHeader, Steps } from "@/components/ui";

export default function CompleteReview() {
  const [certified, setCertified] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [delay, setDelay] = useState<string | null>(null);
  const [extra, setExtra] = useState<string | null>(null);
  const [quality, setQuality] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const canSubmit = certified && agreed && delay && extra && quality;

  if (done)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"><BadgeCheck className="h-7 w-7 text-emerald-600" strokeWidth={1.75} /></span>
        <h1 className="mt-4 text-2xl font-bold">Your verified review is live</h1>
        <p className="mt-3 text-sm text-gray-500">
          Your quantitative answers are reflected in the contractor&apos;s trust metrics immediately. One review per transaction; edits are not allowed after posting.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader title="Project Completion & Verified Review" desc="Al Noor Interiors · Business Bay 3BR Apartment · Completed 2026-09-12" />
      <Steps items={["Verify completion", "Quantitative checklist", "Publish"]} current={certified ? 1 : 0} />

      {/* Step 1: verification */}
      <Card className="mb-6">
        <h2 className="font-bold">1. Verify project completion</h2>
        <p className="mt-1 text-sm text-gray-500">Upload the completion certificate or final payment receipt to unlock the review form.</p>
        {certified ? (
          <Notice tone="green">✓ Document validated — completion_cert_0912.pdf · The review form is now unlocked.</Notice>
        ) : (
          <div className="mt-4">
            <FileDrop label="Upload completion certificate / final payment receipt" />
            <button onClick={() => setCertified(true)} className="mt-3 w-full rounded-xl bg-walnut py-3 text-sm font-bold text-cream hover:bg-walnut-deep">
              Upload &amp; validate (demo)
            </button>
          </div>
        )}
      </Card>

      {/* Step 2: quantitative checklist */}
      <Card className={`mb-6 ${certified ? "" : "pointer-events-none opacity-40"}`}>
        <h2 className="font-bold">2. Quantitative checklist</h2>
        <p className="mt-1 text-sm text-gray-500">Fact-based quantitative items only — no star ratings.</p>
        <div className="mt-5 space-y-5">
          <div>
            <p className="text-sm font-medium">Schedule outcome (planned vs. actual)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["On schedule", "1–7 days late", "8–30 days late", "Over 30 days late"].map((o) => (
                <button key={o} onClick={() => setDelay(o)} className={`rounded-full border px-4 py-1.5 text-sm ${delay === o ? "border-slate-900 bg-walnut text-cream" : "border-gray-200 text-gray-600"}`}>{o}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Government approval duration</p>
            <select className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <option>Within 2 weeks</option><option>3–4 weeks</option><option>5+ weeks</option><option>Not applicable</option>
            </select>
          </div>
          <div>
            <p className="text-sm font-medium">Extra charges beyond contract</p>
            <div className="mt-2 flex gap-2">
              {["None", "Yes (agreed change)", "Yes (unauthorized)"].map((o) => (
                <button key={o} onClick={() => setExtra(o)} className={`rounded-full border px-4 py-1.5 text-sm ${extra === o ? "border-slate-900 bg-walnut text-cream" : "border-gray-200 text-gray-600"}`}>{o}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Overall workmanship</p>
            <div className="mt-2 flex gap-2">
              {["Good", "Issues"].map((o) => (
                <button key={o} onClick={() => setQuality(o)} className={`rounded-full border px-4 py-1.5 text-sm ${quality === o ? "border-slate-900 bg-walnut text-cream" : "border-gray-200 text-gray-600"}`}>{o}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Factual statement (max 200 chars · no emotive language)</p>
            <textarea rows={3} maxLength={200} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="e.g. 12-week schedule kept. DM approval done in 2 weeks. Final amount matched the contract." />
            <p className="mt-1 text-right text-xs text-gray-400">0/200</p>
          </div>
        </div>
      </Card>

      <label className={`flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm ${certified ? "" : "pointer-events-none opacity-40"}`}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-terracotta" />
        <span className="leading-relaxed text-gray-600">
          <b>I agree to the UAE defamation law guidelines.</b> I understand my review must state facts only, and that content containing subjective defamatory or insulting language may be withheld. (Submission is blocked without consent.)
        </span>
      </label>

      <button
        onClick={() => setDone(true)}
        disabled={!canSubmit}
        className="mt-5 w-full rounded-xl bg-terracotta py-4 text-sm font-bold text-cream hover:bg-terracotta-deep disabled:bg-gray-300"
      >
        Publish verified review
      </button>
    </div>
  );
}
