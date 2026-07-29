import { BackLink, Badge, Card, Notice, PageHeader } from "@/components/ui";

export const metadata = { robots: { index: false, follow: false } };

export default function InspectionSchedule() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <BackLink href="/project" label="Back to project" />
      <PageHeader title="QA Inspection Schedule" desc="Inspections are auto-created when a milestone is due. One booking per milestone; rescheduling requires operator approval." />

      <Card className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">M2. Electrical &amp; Plumbing inspection</h2>
          <Badge tone="green">Confirmed</Badge>
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-gray-400">Visit date</dt><dd className="font-bold">Sun, 2026-07-26 10:00</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">Inspector</dt><dd>J. Chung (electrical &amp; MEP specialist, 14 yrs)</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">Checklist scope</dt><dd>Wiring/piping specs, continuity test, waterproofing pre-check</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">Attendance</dt><dd>Site manager required · homeowner optional</dd></div>
        </dl>
        <Notice tone="blue">The confirmed date has been sent to both the homeowner and the contractor. A QA report is issued automatically after the inspection.</Notice>
      </Card>

      <Card>
        <h2 className="font-bold">Past inspections</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span>M1. Demolition &amp; Groundwork inspection</span>
            <span className="flex items-center gap-2 text-xs text-gray-400">2026-07-04 <Badge tone="green">Pass</Badge></span>
          </div>
        </div>
        <button className="mt-5 w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-500 hover:border-gray-400">
          Request reschedule (operator approval required)
        </button>
      </Card>
    </div>
  );
}
