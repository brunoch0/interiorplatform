import type { Metadata } from "next";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import ClaimForm from "./claim-form";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Claim Your Company Profile — Free Verification",
  description: "Dubai contractors: claim your listed profile with your trade licence and DET fit-out licence. Verified profiles rank first and receive homeowner quote requests.",
  alternates: { canonical: `${SITE_URL}/supplier/license` },
};

export default async function ClaimPage() {
  const companies = await fetchCompanies();
  return <ClaimForm companies={companies.map((c) => ({ id: c.id, name: c.name, area: c.area, verified: c.verified }))} />;
}
