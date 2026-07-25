import { ImageResponse } from "next/og";
import { getCompany } from "@/lib/data";
import { fetchCompanyById } from "@/lib/db";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = /^[0-9a-f-]{36}$/.test(id) ? await fetchCompanyById(id) : getCompany(id);
  const name = c?.name ?? "Dubai Interior";
  const area = c?.area ?? "Dubai";
  const cats = c?.categories.slice(0, 3).join(" · ") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#4A3524",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "#FFFDF9", fontSize: 34, fontWeight: 600 }}>Dubai Interior</div>
          <div style={{ color: "#C06A45", fontSize: 34 }}>.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: "#C06A45", fontSize: 24, letterSpacing: 4, textTransform: "uppercase" }}>
            {area} · Dubai
          </div>
          <div style={{ color: "#FFFDF9", fontSize: name.length > 34 ? 52 : 68, lineHeight: 1.1, maxWidth: 1000 }}>
            {name}
          </div>
          {cats && <div style={{ color: "#EFE6D8", fontSize: 28 }}>{cats}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#B9A88F", fontSize: 22 }}>Compare contractors by evidence, not star ratings</div>
          <div
            style={{
              background: "#C06A45",
              color: "#FFFDF9",
              padding: "14px 28px",
              borderRadius: 14,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Request a free quote
          </div>
        </div>
      </div>
    ),
    size,
  );
}
