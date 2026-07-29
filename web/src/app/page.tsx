import type { Metadata } from "next";
import { fetchCompanies, fetchPipelineAed } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import HomeClient from "./home-client";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Dubai Renovation Contractors, Compared by Real Data",
  description:
    "Compare licensed Dubai fit-out contractors by evidence: schedule compliance, extra-charge history, approval speed. Free quotes from verified companies.",
  alternates: { canonical: SITE_URL },
};

export default async function Home() {
  const [companies, pipelineAed] = await Promise.all([fetchCompanies(), fetchPipelineAed()]);
  const total = companies.length;
  const areas = new Set(companies.map((c) => c.area)).size;
  const featured = companies.filter((c) => c.categories.includes("Full Renovation")).slice(0, 3);
  const areaCounts = new Map<string, number>();
  for (const c of companies) if (c.area !== "Dubai") areaCounts.set(c.area, (areaCounts.get(c.area) ?? 0) + 1);
  const topAreas = [...areaCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12) as [string, number][];

  return <HomeClient total={total} areas={areas} pipelineAed={pipelineAed} featured={featured} topAreas={topAreas} />;
}
