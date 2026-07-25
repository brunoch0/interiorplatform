import type { Metadata } from "next";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import ShowcaseForm from "./showcase-form";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Publish Your Project — Free Showcase for Dubai Contractors",
  description: "Contractors: publish your best fit-out and renovation projects on Onepass Interior. Free showcase page with your contact details — reviewed within one business day.",
  alternates: { canonical: `${SITE_URL}/supplier/showcase` },
};

export default async function ShowcasePage() {
  const companies = await fetchCompanies();
  return (
    <ShowcaseForm
      companies={companies.map((c) => ({ id: c.id, name: c.name, area: c.area }))}
    />
  );
}
