import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          background: "#4A3524",
        }}
      >
        {/* arch mark: cream doorway on walnut, terracotta threshold */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 34 }}>
          <div
            style={{
              width: 84,
              height: 78,
              background: "#FFFDF9",
              borderTopLeftRadius: 42,
              borderTopRightRadius: 42,
            }}
          />
          <div style={{ width: 84, height: 14, background: "#C06A45", borderRadius: 7, marginTop: 6 }} />
        </div>
      </div>
    ),
    size,
  );
}
