import type { Metadata } from "next";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import CompaniesBrowser from "./companies-browser";

export const metadata: Metadata = {
  title: "Licensed Interior Fit-Out Companies in Dubai",
  description:
    "Browse every licensed interior fit-out company in Dubai with Google ratings, areas served and verification status. Filter by area, space type and speciality.",
  alternates: { canonical: `${SITE_URL}/companies` },
};

export const revalidate = 300; // refresh directory every 5 minutes

export default async function CompaniesPage() {
  const companies = await fetchCompanies();
  return <CompaniesBrowser companies={companies} />;
}
