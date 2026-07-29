"use client";

import { useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";
import { reviewClaim, signedDocUrl } from "./actions";

export type AdminClaim = {
  id: string;
  status: string;
  company_id: string | null;
  company_name: string | null;
  company_name_submitted: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  trade_license_path: string;
  det_license_path: string | null;
  license_number: string | null;
  license_expiry: string | null;
  reject_reason: string | null;
  created_at: string;
};

export default function ClaimsReview({ claims: initial, adminKey, embedded = false }: { claims: AdminClaim[]; adminKey: string; embedded?: boolean }) {
  const [claims, setClaims] = useState(initial);
  const [reason, setReason] = useState("");
  const [, startTransition] = useTransition();

  const act = (id: string, action: "approve" | "reject") => {
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status: action === "approve" ? "approved" : "rejected" } : c)));
    startTransition(async () => {
      await reviewClaim(adminKey, id, action, action === "reject" ? reason : undefined);
    });
  };

  const openDoc = (path: string) => {
    startTransition(async () => {
      const url = await signedDocUrl(adminKey, path);
      if (url) window.open(url, "_blank");
    });
  };

  const pending = claims.filter((c) => c.status === "pending");

  return (
    <div>
      {embedded ? (
        <div className="mb-1 flex items-baseline gap-3">
          <h2 className="text-lg font-bold">Claims{pending.length > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 font-mono text-xs text-amber-700">{pending.length} pending</span>}</h2>
          <span className="text-xs text-gray-400">approve = Verified badge + top ranking · check against Invest in Dubai / NER</span>
        </div>
      ) : (
        <>
          <PageHeader title="Claims" desc={`${pending.length} awaiting verification · approving sets the Verified badge + top ranking`} />
          <Notice tone="blue">
            Verify against the official register: National Economic Register (economy.gov.ae) or Invest in Dubai — match
            legal name, Active status, expiry, and an interior-related activity.
          </Notice>
        </>
      )}

      <div className="mt-6 space-y-4">
        {claims.map((c) => (
          <Card key={c.id}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold">{c.company_name ?? c.company_name_submitted ?? "Unknown company"}</p>
              <Badge tone={c.status === "approved" ? "green" : c.status === "rejected" ? "red" : "amber"}>{c.status}</Badge>
              <span className="ml-auto text-xs text-gray-400">{new Date(c.created_at).toLocaleString("en-GB", { timeZone: "Asia/Dubai" })}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {c.contact_name} · <span className="font-mono">{c.email}</span>
              {c.phone && <span className="font-mono"> · {c.phone}</span>}
              {c.license_number && <> · Licence <b className="font-mono">{c.license_number}</b></>}
              {c.license_expiry && <> · expires {c.license_expiry}</>}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button onClick={() => openDoc(c.trade_license_path)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 hover:border-gray-400">
                <ExternalLink className="h-3.5 w-3.5" /> Trade licence
              </button>
              {c.det_license_path && (
                <button onClick={() => openDoc(c.det_license_path!)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 hover:border-gray-400">
                  <ExternalLink className="h-3.5 w-3.5" /> DET licence
                </button>
              )}
            </div>
            {c.status === "pending" && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button onClick={() => act(c.id, "approve")} className="rounded-lg bg-terracotta px-5 py-2.5 text-sm font-bold text-cream hover:bg-terracotta-deep">
                  Approve — verify profile
                </button>
                <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reject reason (sent to contractor)"
                  className="w-64 rounded-lg border border-gray-200 px-3 py-2.5 text-xs" />
                <button onClick={() => act(c.id, "reject")} className="rounded-lg border border-red-200 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50">
                  Reject
                </button>
              </div>
            )}
            {c.status === "rejected" && c.reject_reason && <p className="mt-2 text-xs text-red-500">Reason: {c.reject_reason}</p>}
          </Card>
        ))}
        {claims.length === 0 && <Card className="text-center text-sm text-gray-500">No claims yet — outreach sends contractors to /supplier/license.</Card>}
      </div>
    </div>
  );
}
