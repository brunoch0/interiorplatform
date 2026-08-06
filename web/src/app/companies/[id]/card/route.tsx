import { ImageResponse } from "next/og";
import { fetchCompanyById, fetchCompanies } from "@/lib/db";
import { byReviews, TOP_RATED_MIN } from "@/lib/area-stats";

/**
 * A company's own row from the ranking, as an image.
 *
 * Built for outreach: seeing your own figures lands harder than reading them.
 * Everything on it is public Google data plus our ordering — nothing inferred.
 */
export const runtime = "nodejs";
export const revalidate = 3600;

const WALNUT = "#4A3524";
const CREAM = "#FFFDF9";
const TERRACOTTA = "#C06A45";
const SAND = "#D9CEBF";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("not found", { status: 404 });

  const [c, all] = await Promise.all([fetchCompanyById(id), fetchCompanies()]);
  if (!c) return new Response("not found", { status: 404 });

  const ranked = all
    .filter((x) => x.googleRating != null && x.googleRating >= TOP_RATED_MIN)
    .sort(byReviews);
  const pos = ranked.findIndex((x) => x.id === c.id) + 1;

  const stat = (label: string, value: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", fontSize: 22, color: SAND, letterSpacing: 1 }}>{label}</div>
      <div style={{ display: "flex", fontSize: 64, color: CREAM, fontWeight: 700 }}>{value}</div>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: WALNUT,
          padding: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", fontSize: 24, color: TERRACOTTA, letterSpacing: 2 }}>
            ON ONEPASS INTERIOR
          </div>
          <div style={{ display: "flex", fontSize: 54, color: CREAM, fontWeight: 700, lineHeight: 1.15 }}>
            {c.name.slice(0, 60)}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: SAND }}>
            {[c.area, ...c.categories.slice(0, 2)].filter(Boolean).join("  ·  ")}
          </div>
        </div>

        <div style={{ display: "flex", gap: 72 }}>
          {stat("GOOGLE REVIEWS", c.googleRatingCount ? String(c.googleRatingCount) : "—")}
          {stat("RATING", c.googleRating ? c.googleRating.toFixed(1) : "—")}
          {pos > 0 && pos <= 50 && stat("BY REVIEW VOLUME", `top ${pos <= 10 ? 10 : 50}`)}
        </div>

        <div style={{ display: "flex", fontSize: 22, color: SAND }}>
          Public Google Maps data · ordered by review volume across 649 licensed Dubai companies
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
