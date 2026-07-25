import { fetchCompanies } from "@/lib/db";
import QuoteForm from "./quote-form";

export const revalidate = 300;

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const preselected = (c ?? "")
    .split(",")
    .filter((s) => /^[0-9a-f-]{36}$/.test(s))
    .slice(0, 5);
  const companies = await fetchCompanies();
  return <QuoteForm companies={companies} preselected={preselected} />;
}
