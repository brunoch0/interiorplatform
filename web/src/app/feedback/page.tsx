import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { PageHeader } from "@/components/ui";
import FeedbackForm from "./feedback-form";

export const metadata: Metadata = {
  title: "Tell us what's wrong (or missing)",
  description: `${SITE_NAME} is in beta. Report a broken page, a listing with wrong details, or suggest something we should build.`,
  alternates: { canonical: `${SITE_URL}/feedback` },
  // A feedback form has nothing to rank for and would only dilute the guides.
  robots: { index: false, follow: true },
};

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader
        title="Tell us what's wrong"
        desc="We're in beta and building in the open. Broken pages, wrong company details, confusing wording, or something you think should exist — all of it is useful, and all of it is read by a person."
      />

      <div className="mb-6 rounded-2xl border border-gray-200 bg-cream p-5 text-sm leading-relaxed text-gray-600">
        <p className="font-semibold text-charcoal">What&apos;s most useful right now</p>
        <ul className="mt-2 space-y-1.5 pl-5">
          <li className="list-disc">A company listed with the wrong area, specialism or contact details — we&apos;ll fix it the same day.</li>
          <li className="list-disc">Numbers in a guide that don&apos;t match what you were quoted in real life.</li>
          <li className="list-disc">Anything that broke, looked wrong on your phone, or didn&apos;t do what you expected.</li>
        </ul>
      </div>

      <FeedbackForm from={from} />
    </div>
  );
}
