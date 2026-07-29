/** Parse the client-supplied attribution blob defensively — it is untrusted input. */
export function parseAttribution(raw?: string | null): Record<string, string> | null {
  if (!raw || raw.length > 1200) return null;
  try {
    const obj = JSON.parse(raw) as unknown;
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
    const allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "referrer", "landing_path", "first_seen"];
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (allowed.includes(k) && typeof v === "string") out[k] = v.slice(0, 200);
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}
