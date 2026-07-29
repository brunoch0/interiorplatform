"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "@/components/auth-button";
import { useI18n } from "@/lib/i18n/provider";

export default function Nav({ openCount = 0 }: { openCount?: number }) {
  const pathname = usePathname();
  const { dict } = useI18n();
  const t = dict.nav;
  const isAdmin = pathname.startsWith("/admin");
  const isSupplier = pathname.startsWith("/supplier");

  const consumerLinks = [
    { href: "/companies", label: t.findContractors },
    { href: "/requests", label: t.openProjects, count: openCount },
    { href: "/calculator", label: t.costCalculator },
    { href: "/guides", label: t.guides },
  ];
  const supplierLinks = [
    { href: "/supplier/dashboard", label: t.dashboard },
    { href: "/requests", label: t.openProjects, count: openCount },
    { href: "/supplier/showcase", label: t.publishProject },
  ];
  const links = isSupplier ? supplierLinks : consumerLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-[rgba(255,253,249,0.88)] backdrop-blur-[10px]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-baseline gap-1">
            <span className="font-serif text-xl font-semibold tracking-tight text-walnut">
              Dubai&nbsp;Interior
            </span>
            <span className="text-xl leading-none text-terracotta">.</span>
          </Link>
          {!isAdmin && (
            <nav className="hidden items-center gap-6 md:flex">
              {links.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className={`inline-flex items-center gap-1.5 text-sm ${pathname.startsWith(l.href) ? "font-semibold text-charcoal" : "text-gray-500 hover:text-charcoal"}`}
                >
                  {l.label}
                  {"count" in l && (l.count ?? 0) > 0 && (
                    <span className="rounded-full bg-terracotta px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none text-cream">
                      {l.count}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          )}
          {isSupplier && <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">{t.contractorCenter}</span>}
          {isAdmin && <span className="rounded-full bg-walnut px-3 py-1 text-xs font-semibold text-cream">{t.operatorAdmin}</span>}
        </div>
        <div className="flex items-center gap-3">
          {!isSupplier && !isAdmin && (
            <Link href="/consult" className="hidden rounded-xl bg-terracotta px-4 py-2 text-sm font-bold text-cream transition hover:bg-terracotta-deep sm:inline-block">
              {t.freeConsult}
            </Link>
          )}
          <Link href="/supplier/dashboard" className={`text-xs ${isSupplier ? "font-bold text-sky-700" : "font-semibold text-gray-500 hover:text-charcoal"}`}>
            {t.forContractors}
          </Link>
          <Link href="/admin" className={`text-xs ${isAdmin ? "font-bold text-charcoal" : "text-gray-400 hover:text-charcoal"}`}>
            {t.admin}
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
