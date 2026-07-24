"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { companies } from "@/lib/data";
import { Badge, Card, Notice, PageHeader, Steps } from "@/components/ui";

const preselected = ["c1", "c2", "c8"];

export default function QuoteRequest() {
  const [targets, setTargets] = useState<string[]>(preselected);
  const [sent, setSent] = useState(false);
  const verified = companies.filter((c) => c.verified);

  const toggle = (id: string) =>
    setTargets((t) => (t.includes(id) ? t.filter((x) => x !== id) : t.length < 5 ? [...t, id] : t));

  if (sent)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-tint"><MailCheck className="h-7 w-7 text-terracotta-deep" strokeWidth={1.75} /></span>
        <h1 className="mt-4 text-2xl font-bold">Quote requests sent</h1>
        <p className="mt-2 text-sm text-gray-500">
          Sent to {targets.length} contractors simultaneously. Each contractor must submit a quotation within <b>7 days</b>; we&apos;ll notify you as they arrive.
        </p>
        <Link href="/quote/compare" className="mt-8 inline-block rounded-xl bg-walnut px-8 py-3 text-sm font-bold text-cream hover:bg-walnut-deep">
          Go to quote comparison →
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title="Request Multiple Quotes" desc="Send the same request brief to up to 5 contractors at once." />
      <Steps items={["Select contractors", "Write brief", "Send"]} current={1} />

      <Card className="mb-6">
        <h2 className="mb-3 font-bold">Selected contractors ({targets.length}/5)</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {verified.map((c) => (
            <label
              key={c.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                targets.includes(c.id) ? "border-terracotta bg-terracotta-tint" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <input type="checkbox" checked={targets.includes(c.id)} onChange={() => toggle(c.id)} className="accent-terracotta" />
                <span className="font-medium">{c.name}</span>
              </span>
              <Badge tone="green">{c.scheduleComplianceRate}% on schedule</Badge>
            </label>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-4 font-bold">Request brief</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Space type</label>
            <select className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <option>3BR Apartment</option>
              <option>1–2BR Apartment</option>
              <option>Villa</option>
              <option>Commercial</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Budget range</label>
            <select className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <option>AED 100K–200K</option>
              <option>AED 50K–100K</option>
              <option>AED 200K–500K</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Location</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" defaultValue="Business Bay, Executive Towers" />
          </div>
          <div>
            <label className="text-sm font-medium">Preferred start</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" defaultValue="Mid August 2026" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium">Requirements</label>
          <textarea
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
            rows={4}
            defaultValue="Completion needed before end-of-September move-in. Kitchen extension + full renovation of 2 bathrooms. Korean-style storage system preferred. Please include DM approval handling in the quotation."
          />
        </div>
      </Card>

      <Notice tone="blue">
        After sending, each contractor pays a lead fee to accept your request. Unaccepted leads are automatically passed to the next-ranked contractor. Track status on your dashboard.
      </Notice>

      <button
        onClick={() => setSent(true)}
        disabled={targets.length === 0}
        className="mt-6 w-full rounded-xl bg-terracotta py-4 text-sm font-bold text-cream transition hover:bg-terracotta-deep disabled:bg-gray-300"
      >
        Send quote request to {targets.length} contractors
      </button>
    </div>
  );
}
