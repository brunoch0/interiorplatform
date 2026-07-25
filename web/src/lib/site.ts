export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interiorplatform.vercel.app";
export const SITE_NAME = "Dubai Interior";

export function areaSlug(area: string) {
  return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function whatsappShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
