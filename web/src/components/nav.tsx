"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const consumerLinks = [
  { href: "/companies", label: "업체 찾기" },
  { href: "/quote/compare", label: "견적 비교" },
  { href: "/project", label: "공사 관리" },
];

export default function Nav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isSupplier = pathname.startsWith("/supplier");

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-black text-white">D</span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              두바이<span className="text-emerald-600">인테리어</span>
            </span>
          </Link>
          {!isAdmin && !isSupplier && (
            <nav className="hidden items-center gap-6 md:flex">
              {consumerLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm ${pathname.startsWith(l.href) ? "font-semibold text-slate-900" : "text-gray-500 hover:text-slate-900"}`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          )}
          {isSupplier && <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">공급자 센터</span>}
          {isAdmin && <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">운영자 어드민</span>}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/supplier" className={`text-xs ${isSupplier ? "font-bold text-sky-700" : "text-gray-400 hover:text-slate-900"}`}>
            업체회원
          </Link>
          <Link href="/admin" className={`text-xs ${isAdmin ? "font-bold text-slate-900" : "text-gray-400 hover:text-slate-900"}`}>
            어드민
          </Link>
          <Link
            href="/onboarding"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}
