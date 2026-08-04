import type { Metadata } from "next";
import Link from "next/link";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { PageHeader } from "@/components/ui";
import ReportForm from "./report-form";

export const metadata: Metadata = {
  title: "Report an Issue With a Contractor — OnePass Interior Resolution",
  description:
    "Problem with a renovation contractor in Dubai? File a confidential report. We mediate first; unresolved issues affect the contractor's verification and ranking.",
  alternates: { canonical: `${SITE_URL}/report` },
};

export default async function ReportPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const [{ c }, companies] = await Promise.all([searchParams, fetchCompanies()]);
  const opts = companies.map((x) => ({ id: x.id, name: x.name, area: x.area }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        title="Report an issue"
        desc="Delays, surprise charges, quality problems or a contractor gone quiet — tell us what happened. We mediate first, and unresolved issues affect a listed contractor's verification status and ranking."
      />

      <ol className="mb-6 grid gap-3 text-xs text-gray-500 sm:grid-cols-3">
        <li className="rounded-xl bg-sand p-3"><b className="text-charcoal">1 · We mediate.</b> We contact the contractor and push for a fix within 48 hours.</li>
        <li className="rounded-xl bg-sand p-3"><b className="text-charcoal">2 · It goes on record.</b> Unresolved issues affect verification badges and ranking.</li>
        <li className="rounded-xl bg-sand p-3"><b className="text-charcoal">3 · We help you escalate.</b> Evidence pack and guidance for a Dubai Consumer (DET) complaint.</li>
      </ol>

      <ReportForm companies={opts} preselected={c && /^[0-9a-f-]{36}$/.test(c) ? c : null} />

      <p className="mt-6 text-center text-xs text-gray-400">
        Know your rights first:{" "}
        <Link href="/guides/renovation-complaints-dubai" className="font-semibold text-terracotta-deep underline">
          How to complain about a contractor in Dubai →
        </Link>
      </p>
    </div>
  );
}
