"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { Card, Notice } from "@/components/ui";
import { submitBid } from "./actions";

type CompanyOpt = { id: string; name: string; area: string };

const priceBands = ["Under AED 25K", "AED 25K–50K", "AED 50K–100K", "AED 100K–200K", "AED 200K–500K", "AED 500K+", "Need a site visit first"];

export default function BidForm({ requestId, companies }: { requestId: string; companies: CompanyOpt[] }) {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState<CompanyOpt | null>(null);
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
      const res = await submitBid({
        requestId,
        companyId: company?.id ?? null,
        companyName: company?.name ?? String(formData.get("companyName") ?? ""),
        contactName: String(formData.get("contactName") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        priceBand: String(formData.get("priceBand") ?? ""),
        timeline: String(formData.get("timeline") ?? ""),
        message: String(formData.get("message") ?? ""),
        newsletter: formData.get("newsletter") != null,
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
          <CheckCircle2 className="h-6 w-6 text-emerald-600" strokeWidth={1.75} />
        </span>
        <h2 className="mt-3 text-xl font-bold">Quote submitted</h2>
        <p className="mt-2 text-sm text-gray-500">
          Our team reviews it and passes it to the homeowner — you&apos;ll hear back by email or WhatsApp.
          Want priority placement on future briefs?{" "}
          <Link href="/supplier/license" className="font-semibold text-terracotta-deep underline">Verify your profile →</Link>
        </p>
      </Card>
    );

  return (
    <Card>
      <h2 className="font-bold">Submit your quote</h2>
      <p className="mt-1 text-xs text-gray-400">
        Free during early access. We relay your quote to the homeowner — their contact details stay with us until they choose to proceed.
      </p>

      <form action={submit} className="mt-4">
        <p className="text-sm font-medium">Your company</p>
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
            <input name="companyName" placeholder="Not listed? Type your company name"
              className="mt-2 w-full rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm" />
          </>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <select name="priceBand" className="rounded-xl border border-gray-200 px-4 py-3 text-sm">
            {priceBands.map((p) => <option key={p}>{p}</option>)}
          </select>
          <input name="timeline" placeholder="Your timeline, e.g. can start mid-August" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
        </div>
        <textarea name="message" rows={4} maxLength={2000}
          placeholder="Your pitch: relevant experience, what's included at this price band, questions for the homeowner…"
          className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input name="contactName" placeholder="Contact person" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          <input name="email" type="email" required placeholder="Work email *" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          <input name="phone" placeholder="WhatsApp / phone" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
        </div>
        <input name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-gray-500">
          <input type="checkbox" name="newsletter" defaultChecked className="mt-0.5 h-3.5 w-3.5 accent-[#C06A45]" />
          Email me when new briefs matching my trade are posted (optional — unsubscribe anytime)
        </label>

        {error && <div className="mt-3"><Notice tone="red">{error}</Notice></div>}

        <button type="submit" disabled={pending}
          className="mt-4 w-full rounded-xl bg-terracotta py-3.5 text-sm font-bold text-cream transition hover:bg-terracotta-deep disabled:opacity-50">
          {pending ? "Sending…" : "Submit quote — free"}
        </button>
      </form>
    </Card>
  );
}
