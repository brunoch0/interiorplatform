"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";
import { Card, Notice } from "@/components/ui";
import { submitDispute } from "./actions";

type CompanyOpt = { id: string; name: string; area: string };

const issueTypes = [
  "Delays / missed schedule",
  "Extra charges beyond the quote",
  "Poor quality / defects",
  "Deposit paid, contractor unresponsive",
  "Abandoned mid-project",
  "Other",
];
const amountBands = ["Under AED 10K", "AED 10K–50K", "AED 50K–150K", "AED 150K+", "Prefer not to say"];

export default function ReportForm({ companies, preselected }: { companies: CompanyOpt[]; preselected: string | null }) {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState<CompanyOpt | null>(
    () => companies.find((c) => c.id === preselected) ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const suggestions = useMemo(() => {
    const n = search.trim().toLowerCase();
    if (!n || company) return [];
    return companies.filter((c) => c.name.toLowerCase().includes(n)).slice(0, 6);
  }, [search, companies, company]);

  const submit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await submitDispute({
        companyId: company?.id ?? null,
        companyName: company?.name ?? String(formData.get("companyName") ?? ""),
        issueType: String(formData.get("issueType") ?? ""),
        description: String(formData.get("description") ?? ""),
        contractSigned: String(formData.get("contractSigned") ?? ""),
        amountBand: String(formData.get("amountBand") ?? ""),
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        honeypot: String(formData.get("company_website") ?? ""),
      });
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  };

  if (done)
    return (
      <Card className="text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <ShieldCheck className="h-6 w-6 text-emerald-600" strokeWidth={1.75} />
        </span>
        <h2 className="mt-3 text-xl font-bold">Report received</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
          Our team reviews every report within one business day and contacts you before taking any step. If the
          contractor is listed with us, unresolved issues affect their verification status and ranking.
        </p>
        <p className="mt-4 text-xs text-gray-400">
          Need to escalate now? See{" "}
          <Link href="/guides/renovation-complaints-dubai" className="font-semibold text-terracotta-deep underline">
            every complaint channel in Dubai →
          </Link>
        </p>
      </Card>
    );

  return (
    <Card>
      <form action={submit}>
        <p className="text-sm font-medium">Which contractor is this about?</p>
        {company ? (
          <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-terracotta bg-terracotta-tint px-4 py-2 text-sm text-terracotta-deep">
            {company.name} · {company.area}
            <button type="button" onClick={() => { setCompany(null); setSearch(""); }}><X className="h-4 w-4" /></button>
          </span>
        ) : (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search our directory…"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
            />
            {suggestions.length > 0 && (
              <div className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-200">
                {suggestions.map((c) => (
                  <button key={c.id} type="button" onClick={() => setCompany(c)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50">
                    <span>{c.name}</span><span className="text-xs text-gray-400">{c.area}</span>
                  </button>
                ))}
              </div>
            )}
            <input name="companyName" placeholder="Not listed? Type the company name"
              className="mt-2 w-full rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm" />
          </>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <select name="issueType" className="rounded-xl border border-gray-200 px-4 py-3 text-sm">
            {issueTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select name="amountBand" className="rounded-xl border border-gray-200 px-4 py-3 text-sm">
            <option value="">Amount at stake…</option>
            {amountBands.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select name="contractSigned" className="rounded-xl border border-gray-200 px-4 py-3 text-sm">
            <option value="">Written contract?</option>
            <option value="yes">Yes — signed contract</option>
            <option value="no">No — verbal / WhatsApp only</option>
          </select>
        </div>

        <textarea name="description" rows={5} maxLength={4000} required
          placeholder="What happened, in order: what was agreed, what was paid, what went wrong, dates if you have them. The more specific, the faster we can act."
          className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input name="name" required placeholder="Your name *" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          <input name="phone" placeholder="WhatsApp number" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          <input name="email" type="email" placeholder="Email" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
        </div>
        <input name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        {error && <div className="mt-3"><Notice tone="red">{error}</Notice></div>}

        <button type="submit" disabled={pending}
          className="mt-4 w-full rounded-xl bg-terracotta py-3.5 text-sm font-bold text-cream transition hover:bg-terracotta-deep disabled:opacity-50">
          {pending ? "Sending…" : "Submit report"}
        </button>
        <p className="mt-2 text-center text-[11px] text-gray-400">
          Confidential — shared only with our resolution team, never published. We contact you before any action.
        </p>
      </form>
    </Card>
  );
}
