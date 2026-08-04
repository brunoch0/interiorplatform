import type { Company } from "./data";

/**
 * Aggregates over the directory. These numbers are the only thing on an area
 * page that a competitor cannot copy, so they carry the SEO/GEO weight — the
 * page text is built from them rather than from a per-area template.
 */

/** Below this an area page has nothing to say and drags the cluster down. */
export const MIN_INDEXABLE = 10;

/** Google's own bar for "top rated" — kept explicit so the page can state it. */
export const TOP_RATED_MIN = 4.5;

export type CategoryMix = { name: string; count: number; avgRating: number | null };

export type AreaStats = {
  area: string;
  companies: Company[];
  ratedCount: number;
  avgRating: number | null;
  totalReviews: number;
  topRated: Company[];
  categories: CategoryMix[];
  /** Thin pages stay reachable but out of the index. */
  indexable: boolean;
};

function mean(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

export function byReviews(a: Company, b: Company) {
  return (b.googleRatingCount ?? 0) - (a.googleRatingCount ?? 0);
}

export function categoryMix(companies: Company[]): CategoryMix[] {
  const acc = new Map<string, { count: number; ratings: number[] }>();
  for (const c of companies) {
    for (const name of c.categories) {
      const e = acc.get(name) ?? { count: 0, ratings: [] };
      e.count += 1;
      if (c.googleRating) e.ratings.push(c.googleRating);
      acc.set(name, e);
    }
  }
  return [...acc.entries()]
    .map(([name, e]) => ({ name, count: e.count, avgRating: mean(e.ratings) }))
    .sort((a, b) => b.count - a.count);
}

export function areaStats(area: string, companies: Company[]): AreaStats {
  const rated = companies.filter((c) => c.googleRating != null);
  return {
    area,
    companies,
    ratedCount: rated.length,
    avgRating: mean(rated.map((c) => c.googleRating!)),
    totalReviews: companies.reduce((n, c) => n + (c.googleRatingCount ?? 0), 0),
    topRated: rated
      .filter((c) => c.googleRating! >= TOP_RATED_MIN)
      .sort(byReviews),
    categories: categoryMix(companies),
    indexable: companies.length >= MIN_INDEXABLE,
  };
}

export type DirectoryStats = {
  total: number;
  ratedCount: number;
  avgRating: number | null;
  totalReviews: number;
  topRated: Company[];
  categories: CategoryMix[];
  areaCount: number;
};

/** Site-wide totals — the numbers an answer engine can cite us for. */
export function directoryStats(companies: Company[]): DirectoryStats {
  const rated = companies.filter((c) => c.googleRating != null);
  return {
    total: companies.length,
    ratedCount: rated.length,
    avgRating: mean(rated.map((c) => c.googleRating!)),
    totalReviews: companies.reduce((n, c) => n + (c.googleRatingCount ?? 0), 0),
    topRated: rated.filter((c) => c.googleRating! >= TOP_RATED_MIN).sort(byReviews),
    categories: categoryMix(companies),
    areaCount: new Set(companies.filter((c) => c.area !== "Dubai").map((c) => c.area)).size,
  };
}

/** Every real area, largest first. "Dubai" is the unassigned bucket, not a place. */
export function allAreas(companies: Company[]): AreaStats[] {
  const byArea = new Map<string, Company[]>();
  for (const c of companies) {
    if (c.area === "Dubai") continue;
    byArea.set(c.area, [...(byArea.get(c.area) ?? []), c]);
  }
  return [...byArea.entries()]
    .map(([area, cs]) => areaStats(area, cs))
    .sort((a, b) => b.companies.length - a.companies.length);
}
