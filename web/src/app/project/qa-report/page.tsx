import { qaChecklist } from "@/lib/data";
import { BackLink, Badge, Card, Notice, PageHeader } from "@/components/ui";

export const metadata = { robots: { index: false, follow: false } };

export default function QAReport() {
  const passed = qaChecklist.filter((q) => q.result === "Pass").length;
  const failed = qaChecklist.filter((q) => q.result === "Fail");
  const overall = failed.length === 0 && qaChecklist.every((q) => !q.required || q.result !== null);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <BackLink href="/project" label="Back to project" />
      <PageHeader
        title="QA Report"
        desc="M2. Electrical & Plumbing · Report No. QA-2026-0726-A2 · Visible to both parties immediately upon issue"
        action={<button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:border-gray-400">Download PDF</button>}
      />

      <Card className={`mb-6 text-center ${overall ? "bg-emerald-50" : "bg-red-50"}`}>
        <p className="text-xs text-gray-500">Overall result</p>
        <p className={`mt-1 text-3xl font-black ${overall ? "text-emerald-600" : "text-red-600"}`}>
          {overall ? "PASS" : "FAIL (rework requested)"}
        </p>
        <p className="mt-2 text-xs text-gray-500">Inspected 2026-07-26 · Inspector J. Chung · {passed}/{qaChecklist.length} items passed</p>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-4 font-bold">Item results</h2>
        <div className="space-y-2">
          {qaChecklist.map((q) => (
            <div key={q.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{q.label}</p>
                {q.comment && <p className="text-xs text-gray-400">{q.comment} {q.photos > 0 && `· ${q.photos} photos`}</p>}
              </div>
              {q.result === "Pass" && <Badge tone="green">Pass</Badge>}
              {q.result === "Fail" && <Badge tone="red">Fail</Badge>}
              {q.result === null && <Badge tone="gray">Not inspected</Badge>}
            </div>
          ))}
        </div>
      </Card>

      {overall ? (
        <Notice tone="green">
          ✓ Pass report issued — <b>M2 escrow payment (AED 36,250) release has been triggered automatically</b>. Funds reach the contractor&apos;s account within 48 hours.
        </Notice>
      ) : (
        <Notice tone="red">
          {failed.length} failed item(s) — this milestone&apos;s payment is <b>held in escrow</b> and a rework request has been sent to the contractor. Payment is released after a passing re-inspection report.
          <ul className="mt-2 list-disc pl-5 text-xs">
            {failed.map((f) => <li key={f.id}>{f.label}: {f.comment}</li>)}
          </ul>
        </Notice>
      )}

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4 text-xs text-gray-400">
        Inspector signature: J. Chung (digitally signed 2026-07-26 16:10) · Only platform operators can delete or reissue reports.
      </div>
    </div>
  );
}
