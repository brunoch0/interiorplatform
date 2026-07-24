import { inspections } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

export default function AdminInspections() {
  return (
    <div>
      <PageHeader title="QA Inspector Scheduling & Reports" desc="Approve reschedule requests, fix or reissue reports, and communicate with inspectors." />

      <Card className="mb-6">
        <h2 className="mb-4 font-bold">Inspection schedule</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-400">
            <tr><th className="pb-2">Date</th><th className="pb-2">Contract</th><th className="pb-2">Milestone</th><th className="pb-2">Inspector</th><th className="pb-2">Status</th><th className="pb-2"></th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inspections.map((i) => (
              <tr key={i.id}>
                <td className="py-3 text-xs">{i.date}</td>
                <td className="py-3">{i.companyName}<p className="text-xs text-gray-400">{i.consumer}</p></td>
                <td className="py-3 text-xs">{i.milestone}</td>
                <td className="py-3 text-xs">{i.inspector}</td>
                <td className="py-3"><Badge tone={i.status === "Confirmed" ? "green" : "amber"}>{i.status}</Badge></td>
                <td className="py-3 text-right">
                  {i.status === "Pending Approval" && (
                    <span className="flex justify-end gap-1.5">
                      <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white">Approve reschedule</button>
                      <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">Deny</button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-gray-400">Decisions are auto-announced to the inspector, homeowner and contractor. Only approved schedules are finalized in the system.</p>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold">Inspector communication</h2>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-500">J. Chung · 10:32</p>
              <p className="mt-1">Found silicone caulking that needs rework during the M2 inspection. Please send the rework request to the contractor.</p>
            </div>
            <div className="rounded-xl bg-sky-50 p-3 text-right">
              <p className="text-xs font-semibold text-sky-600">Operator A · 10:45</p>
              <p className="mt-1">Confirmed. Rework notification sent. Share the re-inspection date once fixed.</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm" placeholder="Type a message (sends push notification)" />
            <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white">Send</button>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-bold">Report fixes & reissues</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span>QA-2026-0726-A2 (Al Noor · M2)</span>
              <span className="flex gap-1.5">
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">Edit</button>
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">Reissue</button>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span>QA-2026-0704-A1 (Al Noor · M1)</span>
              <span className="flex gap-1.5">
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">Edit</button>
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">Reissue</button>
              </span>
            </div>
          </div>
          <Notice tone="blue">Any edit or reissue is transparently announced to both parties, and the updated report is visible in-app immediately.</Notice>
        </Card>
      </div>
    </div>
  );
}
