"use client";

import { useState } from "react";
import { licenseApplications, type LicenseApplication } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

const tone: Record<LicenseApplication["status"], "amber" | "green" | "red"> = {
  "Under Review": "amber", Approved: "green", Rejected: "red",
};

export default function AdminLicenses() {
  const [apps, setApps] = useState(licenseApplications);

  const decide = (id: string, status: "Approved" | "Rejected") =>
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status, rejectReason: status === "Rejected" ? "Document illegible — resubmission requested" : undefined } : a)));

  return (
    <div>
      <PageHeader title="License Verification Review" desc="Approval/rejection results are pushed to the contractor instantly. Approval transfers profile ownership." />
      <Notice tone="blue">Renewal reminders are sent 30 days before license expiry; profiles auto-deactivate if not renewed.</Notice>

      <div className="mt-6 space-y-4">
        {apps.map((a) => (
          <Card key={a.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{a.companyName}</p>
                  <Badge tone={tone[a.status]}>{a.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-400">Submitted {a.submittedAt} · Claim ID {a.id.toUpperCase()}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-lg border border-gray-200 px-3 py-1.5">📄 {a.tradeLicense}</span>
                  <span className="rounded-lg border border-gray-200 px-3 py-1.5">📄 {a.detLicense}</span>
                  <button className="rounded-lg bg-gray-100 px-3 py-1.5 font-medium hover:bg-gray-200">Check DET validity</button>
                </div>
                {a.rejectReason && <p className="mt-2 text-xs text-red-500">Rejection reason: {a.rejectReason}</p>}
              </div>
              {a.status === "Under Review" && (
                <div className="flex gap-2">
                  <button onClick={() => decide(a.id, "Rejected")} className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">Reject</button>
                  <button onClick={() => decide(a.id, "Approved")} className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600">Approve — transfer ownership</button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 font-bold">Review history</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-400">
            <tr><th className="pb-2">Date</th><th className="pb-2">Company</th><th className="pb-2">Decision</th><th className="pb-2">Reviewer</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr><td className="py-2">2026-07-10</td><td>Downtown Spaceworks</td><td><Badge tone="green">Approved</Badge></td><td>Operator A</td></tr>
            <tr><td className="py-2">2026-07-08</td><td>QuickFix Deco</td><td><Badge tone="red">Rejected</Badge></td><td>Operator A</td></tr>
            <tr><td className="py-2">2026-07-02</td><td>Serenity Interiors</td><td><Badge tone="green">Renewal approved</Badge></td><td>Operator B</td></tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
