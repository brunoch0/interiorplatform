export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onepassinterior.com";
export const SITE_NAME = "Dubai Interior";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

// Shared with both server and client components — keep free of client-only imports
export const companyPhotoUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${path}`;

export const mapsUrl = (name: string, placeId: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${placeId}`;

export function areaSlug(area: string) {
  return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Tag an internal path for attribution. Every outbound/shared link should go
 * through this so GA4 never reports a viral click as (direct)/(none).
 */
export function withUtm(
  path: string,
  { source, medium, campaign = "viral_share", content }: { source: string; medium: string; campaign?: string; content?: string },
) {
  const [base, existing] = path.split("?");
  const qs = new URLSearchParams(existing);
  qs.set("utm_source", source);
  qs.set("utm_medium", medium);
  qs.set("utm_campaign", campaign);
  if (content) qs.set("utm_content", content);
  return `${SITE_URL}${base}?${qs.toString()}`;
}

export function whatsappShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} mo ago`;
}
