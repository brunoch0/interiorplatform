import type { Metadata } from "next";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import QuoteForm from "./quote-form";

export const metadata: Metadata = {
  title: "Request Free Renovation Quotes in Dubai",
  description:
    "Describe your renovation once and get quotes from up to 5 licensed Dubai contractors. Free, no phone number required, no obligation to hire.",
  alternates: { canonical: `${SITE_URL}/quote` },
};

export const revalidate = 300;

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ c?: string; src?: string }> }) {
  const { c, src } = await searchParams;
  const preselected = (c ?? "")
    .split(",")
    .filter((s) => /^[0-9a-f-]{36}$/.test(s))
    .slice(0, 5);
  const companies = await fetchCompanies();
  return <QuoteForm companies={companies} preselected={preselected} src={src} />;
}
