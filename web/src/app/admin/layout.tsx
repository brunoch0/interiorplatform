"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScrollText, SearchCheck, Scale, HardHat, TrendingUp, Inbox, Building2, Images } from "lucide-react";

const menu = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", Icon: Inbox },
  { href: "/admin/companies", label: "Companies", Icon: Building2 },
  { href: "/admin/projects", label: "Showcases", Icon: Images },
  { href: "/admin/licenses", label: "License Review", Icon: ScrollText },
  { href: "/admin/reviews", label: "Review Monitoring", Icon: SearchCheck },
  { href: "/admin/disputes", label: "Dispute Mediation", Icon: Scale },
  { href: "/admin/inspections", label: "QA Inspections", Icon: HardHat },
  { href: "/admin/kpi", label: "KPI Analytics", Icon: TrendingUp },
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
                  active ? "bg-walnut font-semibold text-cream" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <m.Icon className="h-4 w-4" strokeWidth={1.75} /> {m.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
