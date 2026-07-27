import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { PageHeader } from "@/components/ui";
import CostCalculator from "./calculator";

export const metadata: Metadata = {
  title: "Dubai Renovation Cost Calculator (2026) — Instant Planning Range",
  description:
    "Free Dubai renovation cost calculator: get a realistic 2026 planning range for your apartment or villa by scope and finish level, based on quoted projects — no signup needed.",
  alternates: { canonical: `${SITE_URL}/calculator` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does it cost to renovate an apartment in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A full apartment renovation in Dubai typically costs AED 25,000-60,000 for a studio, AED 60,000-100,000 for a 1-bedroom, AED 100,000-180,000 for a 2-bedroom and AED 150,000-250,000 for a 3-bedroom at a standard finish level. Per square foot, budget work runs AED 80-150, standard AED 150-250 and premium AED 250-400.",
      },
    },
    {
      "@type": "Question",
      name: "Is this calculator a quote?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — it is a planning range based on quoted Dubai projects. Actual pricing depends on scope, materials and site conditions. You can request free quotes from up to 5 licensed Dubai contractors through the platform to get real numbers for your project.",
      },
    },
  ],
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <PageHeader
        title="Renovation Cost Calculator"
        desc="A realistic Dubai planning range in 10 seconds — based on quoted projects, not wishful thinking. No signup, no phone number."
      />
      <CostCalculator />
      <p className="mt-8 text-center text-xs text-gray-400">
        Want the detail behind these numbers? Read the full guides:{" "}
        <Link href="/guides/apartment-renovation-cost-dubai" className="font-semibold text-terracotta-deep underline">apartments</Link>,{" "}
        <Link href="/guides/villa-renovation-cost-dubai" className="font-semibold text-terracotta-deep underline">villas</Link>,{" "}
        <Link href="/guides/kitchen-bathroom-renovation-cost-dubai" className="font-semibold text-terracotta-deep underline">kitchens &amp; bathrooms</Link>.
      </p>
    </div>
  );
}
