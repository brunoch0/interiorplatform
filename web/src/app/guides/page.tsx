import type { Metadata } from "next";
import { guides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";
import EmailCapture from "@/components/email-capture";
import { PageHeader } from "@/components/ui";
import GuidesBrowser from "./guides-browser";

export const metadata: Metadata = {
  title: "Dubai Renovation Guides — Costs, Permits, Contracts & Your Rights",
  description: "Practical guides for every stage of renovating in Dubai: real 2026 costs, DM approvals and NOCs, contractor vetting, managing the works, snagging and consumer rights.",
  alternates: { canonical: `${SITE_URL}/guides` },
};

export default function GuidesIndex() {
  const cards = guides.map(({ slug, title, description, updated, readMinutes, category }) => ({
    slug, title, description, updated, readMinutes, category,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        title="Renovation Guides"
        desc="Every stage of a Dubai renovation — planning, permits, hiring, the works, handover, and what to do when things go wrong. Written for Dubai, updated for 2026."
      />
      <GuidesBrowser guides={cards} />
      <div className="mt-10">
        <EmailCapture source="guides-index" />
      </div>
    </div>
  );
}
