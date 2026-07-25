"use client";

import { useMemo, useState, useTransition } from "react";
import { MailCheck } from "lucide-react";
import type { Company } from "@/lib/data";
import { Card, Notice, PageHeader, Steps } from "@/components/ui";
import { submitQuoteRequest } from "./actions";

const spaceTypes = ["Apartment", "Villa", "Commercial", "Not sure yet"];
const budgets = ["Under AED 50K", "AED 50K–100K", "AED 100K–200K", "AED 200K–500K", "AED 500K+"];
const timelines = ["As soon as possible", "Within 1–2 months", "Within 3–6 months", "Just exploring"];

export default function QuoteForm({ companies, preselected }: { companies: Company[]; preselected: string[] }) {
  const [targets, setTargets] = useState<string[]>(preselected);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const byId = useMemo(() => new Map(companies.map((c) => [c.id, c])), [companies]);

  const suggestions = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return [];
    return companies
      .filter((c) => !targets.includes(c.id) && c.name.toLowerCase().includes(needle))
      .slice(0, 6);
  }, [search, companies, targets]);

  const submit = (formData: FormData) => {
    formData.set("companyIds", targets.join(","));
    setError(null);
    startTransition(async () => {
      const res = await submitQuoteRequest(formData);
      if (res.ok) setRef(res.ref);
      else setError(res.error);
    });
  };

  if (ref)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-tint">
          <MailCheck className="h-7 w-7 text-terracotta-deep" strokeWidth={1.75} />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Request received</h1>
        <p className="mt-2 text-sm text-gray-500">
          Reference <b className="font-mono text-charcoal">{ref}</b>. Our team reviews every request and connects you
          with the selected contractors — you&apos;ll hear from us within one business day
          {targets.length > 0 && <> about your {targets.length} selected contractor{targets.length > 1 ? "s" : ""}</>}.
        </p>
        <p className="mt-4 text-xs text-gray-400">
          No account needed. Your contact details are shared only with the contractors you selected.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title="Request Quotes" desc="Tell us about your project once — we send it to up to 5 contractors of your choice." />
      <Steps items={["Select contractors", "Project brief", "Send"]} current={1} />

      <Card className="mb-6">
        <h2 className="mb-1 font-bold">Selected contractors ({targets.length}/5)</h2>
        <p className="mb-4 text-xs text-gray-400">Optional — leave empty and our team will shortlist for you based on your brief.</p>
        {targets.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {targets.map((id) => (
              <span key={id} className="inline-flex items-center gap-2 rounded-full border border-terracotta bg-terracotta-tint px-3 py-1.5 text-sm text-terracotta-deep">
                {byId.get(id)?.name ?? "Unknown"}
                <button type="button" onClick={() => setTargets((t) => t.filter((x) => x !== id))} className="font-bold">×</button>
              </span>
            ))}
          </div>
        )}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contractors to add…"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
        {suggestions.length > 0 && (
          <div className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-200">
            {suggestions.map((c) => (
              <button
                key={c.id}
                type="button"
                disabled={targets.length >= 5}
                onClick={() => { setTargets((t) => [...t, c.id]); setSearch(""); }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50 disabled:opacity-40"
              >
                <span>{c.name}</span>
                <span className="text-xs text-gray-400">{c.area}</span>
              </button>
            ))}
          </div>
        )}
      </Card>

      <form action={submit}>
        <Card className="mb-6">
          <h2 className="mb-4 font-bold">Project brief</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Space type</label>
              <select name="spaceType" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
                {spaceTypes.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Budget range</label>
              <select name="budget" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
                {budgets.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Location / community</label>
              <input name="area" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="e.g. Business Bay, Executive Towers" />
            </div>
            <div>
              <label className="text-sm font-medium">Timeline</label>
              <select name="timeline" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
                {timelines.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium">What do you need done?</label>
            <textarea
              name="details"
              rows={4}
              maxLength={2000}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              placeholder="e.g. 3BR apartment full renovation — kitchen extension, 2 bathrooms, completion before end of September."
            />
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="mb-4 font-bold">Your contact</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <input name="name" required className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-medium">WhatsApp / phone</label>
              <input name="phone" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="+971 50 123 4567" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input name="email" type="email" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="you@example.com" />
            </div>
          </div>
          {/* honeypot */}
          <input name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <p className="mt-3 text-xs text-gray-400">Phone or email — at least one, so contractors can reach you.</p>
        </Card>

        {error && <Notice tone="red">{error}</Notice>}

        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-xl bg-terracotta py-4 text-sm font-bold text-cream transition hover:bg-terracotta-deep disabled:opacity-50"
        >
          {pending ? "Sending…" : targets.length > 0 ? `Send request to ${targets.length} contractor${targets.length > 1 ? "s" : ""}` : "Send request — we'll shortlist for you"}
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          Free for homeowners. No spam — your request goes only to the contractors involved.
        </p>
      </form>
    </div>
  );
}
