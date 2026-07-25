// Supabase data layer — real contractor directory (public read via RLS)
import { createClient } from "@supabase/supabase-js";
import type { Company } from "./data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Row = {
  id: string;
  name: string;
  area: string | null;
  categories: string[] | null;
  space_types: string[] | null;
  website: string | null;
  verified: boolean;
  price_range: string | null;
  intro: string | null;
  schedule_compliance_rate: number | null;
  no_extra_charge_rate: number | null;
  verified_review_count: number;
  avg_approval_weeks: number | null;
  portfolio_count: number;
  exposure_package: string | null;
  license_expiry: string | null;
  contact_verified: boolean;
  portfolio_verified: boolean;
};

function toCompany(r: Row): Company {
  return {
    id: r.id,
    name: r.name,
    legalName: r.name,
    verified: r.verified,
    area: r.area ?? "Dubai",
    categories: r.categories ?? [],
    spaceTypes: r.space_types ?? [],
    priceRange: r.price_range ?? "Not listed",
    intro:
      r.intro ??
      "Listed from public sources. Full details become visible after the owner claims this profile.",
    scheduleComplianceRate: r.schedule_compliance_rate,
    noExtraChargeRate: r.no_extra_charge_rate,
    verifiedReviewCount: r.verified_review_count,
    avgApprovalWeeks: r.avg_approval_weeks,
    portfolioCount: r.portfolio_count,
    licenseExpiry: r.license_expiry ?? "-",
    exposurePackage: (r.exposure_package as Company["exposurePackage"]) ?? null,
    contactVerified: r.contact_verified,
    portfolioVerified: r.portfolio_verified,
  };
}

const COLS =
  "id,name,area,categories,space_types,website,verified,price_range,intro,schedule_compliance_rate,no_extra_charge_rate,verified_review_count,avg_approval_weeks,portfolio_count,exposure_package,license_expiry,contact_verified,portfolio_verified";

export async function fetchCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from("companies")
    .select(COLS)
    .order("verified", { ascending: false })
    .order("name");
  if (error) throw error;
  return (data as Row[]).map(toCompany);
}

export async function fetchCompanyById(id: string): Promise<Company | null> {
  const { data, error } = await supabase.from("companies").select(COLS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toCompany(data as Row) : null;
}

export async function fetchStats() {
  const { count } = await supabase.from("companies").select("*", { count: "exact", head: true });
  return { total: count ?? 0 };
}

export async function fetchPipelineAed(): Promise<number> {
  const { data } = await supabase.rpc("public_stats");
  return (data as { pipeline_aed?: number } | null)?.pipeline_aed ?? 0;
}
