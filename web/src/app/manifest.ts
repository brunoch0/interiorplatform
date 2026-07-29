import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Dubai renovation, verified`,
    short_name: SITE_NAME,
    description:
      "Compare licensed Dubai fit-out contractors by evidence, get free quotes, and check renovation costs before you commit.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#4A3524",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
