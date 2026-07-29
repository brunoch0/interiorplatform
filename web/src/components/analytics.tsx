"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";
import { GA_ID } from "@/lib/site";

type GtagParams = Record<string, string | number | boolean | undefined>;

/** Fire a GA4 event from a user action. No-ops when GA is not configured. */
export function track(event: string, params: GtagParams = {}) {
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", event, params);
}

/**
 * App Router does not re-run gtag('config') on client navigation, so page_view
 * must be sent manually. Pairs with send_page_view:false in the loader.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    captureAttribution(); // must run even when GA is disabled (dev/preview)
    if (!GA_ID) return;
    const qs = search.toString();
    track("page_view", {
      page_path: qs ? `${pathname}?${qs}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}
