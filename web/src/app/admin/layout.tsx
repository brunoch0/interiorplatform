"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/licenses", label: "License Review", icon: "📜" },
  { href: "/admin/reviews", label: "Review Monitoring", icon: "🔍" },
  { href: "/admin/disputes", label: "Dispute Mediation", icon: "⚖️" },
  { href: "/admin/inspections", label: "QA Inspections", icon: "🏗️" },
  { href: "/admin/kpi", label: "KPI Analytics", icon: "📈" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <aside className="hidden w-52 shrink-0 lg:block">
        <nav className="sticky top-24 space-y-1">
          {menu.map((m) => {
            const active = m.href === "/admin" ? pathname === "/admin" : pathname.startsWith(m.href);
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm ${
                  active ? "bg-slate-900 font-semibold text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <span>{m.icon}</span> {m.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
