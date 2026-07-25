import Link from "next/link";
import type { Metadata } from "next";
import { guides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";
import EmailCapture from "@/components/email-capture";
import { Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Dubai Renovation Guides — Costs, Permits & Contracts",
  description: "Practical guides for renovating in Dubai: real 2026 cost ranges, DM approvals and NOCs, contractor selection, and contract checklists. No fluff, no hype.",
  alternates: { canonical: `${SITE_URL}/guides` },
};

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        title="Renovation Guides"
        desc="What things actually cost, which approvals you actually need, and how to avoid the traps — written for Dubai, updated for 2026."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {guides.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`}>
            <Card className="h-full transition hover:shadow-md">
              <p className="text-xs text-gray-400">{g.readMinutes} min read · updated {g.updated}</p>
              <h2 className="mt-2 text-lg font-bold leading-snug">{g.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{g.description}</p>
              <p className="mt-3 text-sm font-semibold text-terracotta-deep">Read guide →</p>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-10">
        <EmailCapture source="guides-index" />
      </div>
    </div>
  );
}
