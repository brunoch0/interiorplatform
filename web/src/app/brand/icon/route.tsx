import { ImageResponse } from "next/og";

/**
 * Square brand mark at social-profile resolution. Facebook, Instagram and
 * LinkedIn all crop to a circle, so the arch sits centred with generous margin
 * rather than filling the frame like the 32px favicon does.
 */
export const runtime = "edge";

const SIZE = 1080;
const WALNUT = "#4A3524";
const CREAM = "#FFFDF9";
const TERRACOTTA = "#C06A45";

export async function GET() {
  const arch = Math.round(SIZE * 0.46);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: WALNUT,
        }}
      >
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
            height: Math.round(arch * 0.17),
            background: TERRACOTTA,
            borderRadius: Math.round(arch * 0.085),
            marginTop: Math.round(arch * 0.07),
          }}
        />
      </div>
    ),
    { width: SIZE, height: SIZE },
  );
}
