import { fetchCompanies } from "@/lib/db";
import CompaniesBrowser from "./companies-browser";

export const revalidate = 300; // refresh directory every 5 minutes

export default async function CompaniesPage() {
  const companies = await fetchCompanies();
  return <CompaniesBrowser companies={companies} />;
}
