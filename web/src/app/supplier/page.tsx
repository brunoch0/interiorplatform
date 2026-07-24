import Link from "next/link";
import { fmt, supplierLeads } from "@/lib/data";
import { Badge, Card, PageHeader, Stat } from "@/components/ui";

export default function SupplierDashboard() {
  const newLeads = supplierLeads.filter((l) => l.status === "New").length;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Contractor Dashboard"
        desc="Al Noor Interiors (Al Noor Interiors LLC) · Verified · Premium exposure active"
        action={<Badge tone="green">DET license valid (expires 2027-03-15)</Badge>}
      />

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Stat label="New leads" value={`${newLeads}`} sub="Respond within 24 hours" tone="good" />
        <Stat label="Profile views this month" value={fmt(1284)} sub="+32% vs last month" tone="good" />
        <Stat label="Active projects" value="3" sub="Incl. 2 escrow contracts" />
        <Stat label="Lead fees this month" value={`AED ${fmt(1450)}`} sub="Settlement due Aug 1" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/supplier/profile", icon: "🖼️", title: "Profile & Portfolio", desc: "42 photos registered · 3 awaiting moderation" },
          { href: "/supplier/license", icon: "📜", title: "License Verification", desc: "Verified · renewal reminder due 2027-02-15" },
          { href: "/supplier/leads", icon: "📥", title: "Incoming Quote Requests", desc: `${newLeads} new · awaiting your response` },
          { href: "/supplier/packages", icon: "🚀", title: "Exposure Packages", desc: "Premium active · expires Aug 15" },
        ].map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="h-full transition hover:shadow-md">
              <span className="text-2xl">{m.icon}</span>
              <h2 className="mt-3 font-bold">{m.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{m.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <h2 className="mb-4 font-bold">My trust metrics <span className="ml-2 text-xs font-normal text-gray-400">(auto-computed from verified reviews · not editable)</span></h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["96%", "Schedule compliance"],
            ["92%", "No extra charges"],
            ["34", "Verified reviews"],
            ["2.1 wks", "Avg. approval time"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-2xl font-black">{v}</p>
              <p className="mt-1 text-xs text-gray-400">{l}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
