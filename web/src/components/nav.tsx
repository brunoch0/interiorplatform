"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "@/components/auth-button";

const consumerLinks = [
  { href: "/companies", label: "Find Contractors" },
  { href: "/projects", label: "Projects" },
  { href: "/guides", label: "Guides" },
  { href: "/quote", label: "Get Quotes" },
];

export default function Nav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isSupplier = pathname.startsWith("/supplier");

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
          {!isAdmin && !isSupplier && (
            <nav className="hidden items-center gap-6 md:flex">
              {consumerLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm ${pathname.startsWith(l.href) ? "font-semibold text-charcoal" : "text-gray-500 hover:text-charcoal"}`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          )}
          {isSupplier && <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Contractor Center</span>}
          {isAdmin && <span className="rounded-full bg-walnut px-3 py-1 text-xs font-semibold text-cream">Operator Admin</span>}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/supplier/license" className={`text-xs ${isSupplier ? "font-bold text-sky-700" : "text-gray-400 hover:text-charcoal"}`}>
            For Contractors
          </Link>
          <Link href="/admin" className={`text-xs ${isAdmin ? "font-bold text-charcoal" : "text-gray-400 hover:text-charcoal"}`}>
            Admin
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
