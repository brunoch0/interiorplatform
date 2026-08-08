import { ImageResponse } from "next/og";
import { fetchCompanyById, fetchCompanies } from "@/lib/db";
import { byReviews, TOP_RATED_MIN } from "@/lib/area-stats";

/**
 * A company's own row from the directory, as an image.
 *
 * Built for outreach: a contractor seeing their own figures lands harder than
 * reading them in a sentence. Styled as the site's own listing card — cream on
 * sand, serif name, pill badges — so a recipient who clicks through recognises
 * the page they land on. Everything shown is public Google data plus our
 * ordering; nothing is inferred.
 */
export const runtime = "nodejs";
export const revalidate = 3600;

const SAND = "#F6F0E6";
const CREAM = "#FFFDF9";
const WALNUT = "#4A3524";
const CHARCOAL = "#2A2520";
const TERRACOTTA = "#C06A45";
const BORDER = "#E5DED2";
const MUTED = "#8C765B";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // ?square renders 1080x1080 for Instagram; default stays 1200x630 for email.
  const square = new URL(req.url).searchParams.has("square");
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("not found", { status: 404 });

  const [c, all] = await Promise.all([fetchCompanyById(id), fetchCompanies()]);
  if (!c) return new Response("not found", { status: 404 });

  const ranked = all
    .filter((x) => x.googleRating != null && x.googleRating >= TOP_RATED_MIN)
    .sort(byReviews);
  const pos = ranked.findIndex((x) => x.id === c.id) + 1;

  const pill = (text: string) => (
    <div
      key={text}
      style={{
        display: "flex",
        borderRadius: 999,
        background: SAND,
        color: MUTED,
        padding: "8px 20px",
        fontSize: 24,
      }}
    >
      {text}
    </div>
  );

  const stat = (label: string, value: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", fontSize: 20, color: MUTED, letterSpacing: 1.5 }}>{label}</div>
      <div style={{ display: "flex", fontSize: 56, color: CHARCOAL, fontWeight: 700 }}>{value}</div>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: SAND,
          padding: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // 1:1 spreads the three blocks to the edges and leaves the middle
            // empty, so centre them there and only justify on the wide card.
            justifyContent: square ? "center" : "space-between",
            gap: square ? 56 : 0,
            width: "100%",
            background: CREAM,
            border: `2px solid ${BORDER}`,
            borderRadius: 28,
            padding: 48,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", fontSize: 26, color: WALNUT, fontWeight: 700, letterSpacing: 0.5 }}>
                OnePass Interior
              </div>
              <div style={{ display: "flex", fontSize: 26, color: TERRACOTTA }}>.</div>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 50,
                color: CHARCOAL,
                fontWeight: 600,
                lineHeight: 1.15,
              }}
            >
              {c.name.slice(0, 58)}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {[c.area, ...c.categories.slice(0, 2)].filter(Boolean).map((x) => pill(String(x)))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 64, alignItems: "flex-end" }}>
            {stat("GOOGLE RATING", c.googleRating ? c.googleRating.toFixed(1) : "—")}
            {stat("REVIEWS", c.googleRatingCount ? String(c.googleRatingCount) : "—")}
            {pos > 0 && pos <= 50 && stat("BY REVIEW VOLUME", `top ${pos <= 10 ? 10 : 50}`)}
          </div>

          <div style={{ display: "flex", fontSize: 20, color: MUTED }}>
            Google Maps data, refreshed monthly · ordered by review volume across 649 licensed Dubai companies
          </div>
        </div>
      </div>
    ),
    square ? { width: 1080, height: 1080 } : { width: 1200, height: 630 },
  );
}
