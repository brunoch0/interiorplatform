import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { PageHeader } from "@/components/ui";
import ConsultChat from "./consult-chat";

export const metadata: Metadata = {
  title: "Free Renovation Consultation in Dubai — Not Sure Where to Start?",
  description:
    "Describe your place in your own words. Our assistant turns it into a clear renovation brief, and our team follows up on WhatsApp with practical next steps — free.",
  alternates: { canonical: `${SITE_URL}/consult` },
};

export default function ConsultPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        title="Not sure where to start?"
        desc="Most people aren't. Tell us about your place in plain words — we'll turn it into a proper brief and walk you through the next steps on WhatsApp. Free, no obligation."
      />
      <ConsultChat />
      <p className="mt-6 text-center text-xs text-gray-400">
        Already know exactly what you need?{" "}
        <Link href="/quote" className="font-semibold text-terracotta-deep underline">Request quotes directly →</Link>
      </p>
    </div>
  );
}
