"use client";

/**
 * First-touch attribution. Captured on the first page of a visit and kept for
 * 90 days, so a lead submitted days later still credits the channel that
 * brought the person in — GA4 only reports sessions, this survives to the row.
 */
const KEY = "op_attr";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_path?: string;
  first_seen?: string;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Attribution;
      const age = Date.now() - new Date(parsed.first_seen ?? 0).getTime();
      if (age < TTL_MS) return; // first touch already recorded and still valid
    }

    const params = new URLSearchParams(window.location.search);
    const attr: Attribution = { first_seen: new Date().toISOString(), landing_path: window.location.pathname };
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) attr[k] = v.slice(0, 120);
    }
    // Only external referrers are useful; internal navigation is noise
    const ref = document.referrer;
    if (ref && !ref.includes(window.location.host)) attr.referrer = ref.slice(0, 200);

    window.localStorage.setItem(KEY, JSON.stringify(attr));
  } catch {
    /* private mode / storage disabled — attribution is best-effort */
  }
}

/** Serialized first-touch attribution for submission with a lead, or null. */
export function readAttribution(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
