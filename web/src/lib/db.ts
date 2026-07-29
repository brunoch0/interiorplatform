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
  google_rating: number | null;
  google_rating_count: number | null;
  place_id: string | null;
  photo_path: string | null;
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
    googleRating: r.google_rating,
    googleRatingCount: r.google_rating_count,
    placeId: r.place_id,
    photoPath: r.photo_path,
  };
}

const COLS =
  "id,name,area,categories,space_types,website,verified,price_range,intro,schedule_compliance_rate,no_extra_charge_rate,verified_review_count,avg_approval_weeks,portfolio_count,exposure_package,license_expiry,contact_verified,portfolio_verified,google_rating,google_rating_count,place_id,photo_path";

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

export type ProjectBlock =
  | { type: "text"; text: string }
  | { type: "image"; path: string; caption?: string };

export type Project = {
  id: string;
  slug: string | null;
  title: string;
  area: string | null;
  space_type: string | null;
  budget_band: string | null;
  duration_weeks: number | null;
  description: string | null;
  photos: string[];
  content: ProjectBlock[];
  company_id: string | null;
  created_at: string;
};

const PROJECT_COLS = "id,slug,title,area,space_type,budget_band,duration_weeks,description,photos,content,company_id,created_at";

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data } = await supabase.from("projects").select(PROJECT_COLS).eq("slug", slug).maybeSingle();
  return (data as Project) ?? null;
}

export async function fetchCompanyProjects(companyId: string): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select(PROJECT_COLS)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Project[];
}

export function projectPhotoUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${path}`;
}
