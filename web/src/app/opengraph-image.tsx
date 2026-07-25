import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ color: "#FFFDF9", fontSize: 34, fontWeight: 600 }}>Dubai Interior</div>
          <div style={{ color: "#C06A45", fontSize: 34 }}>.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#FFFDF9", fontSize: 72, lineHeight: 1.1, maxWidth: 1000 }}>
            Find Dubai contractors by data, not star ratings.
          </div>
          <div style={{ color: "#EFE6D8", fontSize: 30 }}>
            649 licensed fit-out companies · free quotes · escrow-ready
          </div>
        </div>
        <div style={{ color: "#B9A88F", fontSize: 22 }}>interiorplatform.vercel.app</div>
      </div>
    ),
    size,
  );
}
