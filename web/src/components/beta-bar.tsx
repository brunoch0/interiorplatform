"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Site-wide beta notice. Carries the current path into the feedback form so a
 * report arrives with the page already attached — the detail people skip.
 */
export default function BetaBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/feedback")) return null;

  return (
    <div className="border-b border-terracotta/20 bg-terracotta/[0.07] px-4 py-2 text-center text-xs leading-relaxed text-charcoal">
      <span className="mr-1.5 rounded-full bg-terracotta px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cream">
        Beta
      </span>
      We&apos;re still building. Found something broken or wrong?{" "}
      <Link
        href={`/feedback?from=${encodeURIComponent(pathname)}`}
        className="font-semibold underline decoration-terracotta decoration-2 underline-offset-2 hover:text-terracotta-deep"
      >
        Tell us
      </Link>{" "}
      — we read everything.
    </div>
  );
}
