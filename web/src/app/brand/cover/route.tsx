import { ImageResponse } from "next/og";

/**
 * Facebook page cover at 2x. Facebook crops this hard on mobile — roughly the
 * middle 640x360 of the desktop frame survives — so everything that has to be
 * readable stays inside a centred band and the edges carry colour only.
 */
export const runtime = "edge";

const W = 1640;
const H = 624;
const WALNUT = "#4A3524";
const CREAM = "#FFFDF9";
const TERRACOTTA = "#C06A45";
const SAND = "#E8DFD3";

export async function GET() {
  const arch = 132;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: WALNUT,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: arch,
                height: Math.round(arch * 0.93),
                background: CREAM,
                borderTopLeftRadius: arch / 2,
                borderTopRightRadius: arch / 2,
              }}
            />
            <div
              style={{
                width: arch,
                height: 22,
                background: TERRACOTTA,
                borderRadius: 11,
                marginTop: 10,
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 78, fontWeight: 700, color: CREAM, letterSpacing: -1 }}>
              OnePass Interior
            </div>
            <div style={{ display: "flex", fontSize: 33, color: SAND, marginTop: 14 }}>
              Every licensed fit-out company in Dubai — 649, compared by data.
            </div>
            <div style={{ display: "flex", fontSize: 27, color: TERRACOTTA, marginTop: 20, fontWeight: 600 }}>
              onepassinterior.com
            </div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
}
