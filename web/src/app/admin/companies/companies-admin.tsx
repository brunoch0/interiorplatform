"use client";

import { useMemo, useState, useTransition } from "react";
import { MessageCircle, Phone, Globe, Check } from "lucide-react";
import { Badge, Card, PageHeader } from "@/components/ui";
import { adminUpdateCompany } from "./actions";

export type AdminCompany = {
  id: string;
  name: string;
  area: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  ops_notes: string | null;
  categories: string[] | null;
  verified: boolean;
  contact_verified: boolean;
  portfolio_verified: boolean;
};

const filters = ["All", "Unverified", "Contact ✓", "Portfolio ✓"] as const;

function waLink(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = "971" + d.slice(1);
  else if (!d.startsWith("971")) d = "971" + d;
  return `https://wa.me/${d}`;
}

export default function CompaniesAdmin({ companies: initial, adminKey }: { companies: AdminCompany[]; adminKey: string }) {
  const [companies, setCompanies] = useState(initial);
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [limit, setLimit] = useState(50);
  const [, startTransition] = useTransition();

  const areas = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of companies) if (c.area && c.area !== "Dubai") counts.set(c.area, (counts.get(c.area) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([a]) => a);
  }, [companies]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return companies.filter((c) => {
      if (needle && !c.name.toLowerCase().includes(needle)) return false;
      if (area && c.area !== area) return false;
      if (filter === "Unverified" && (c.contact_verified || c.portfolio_verified)) return false;
      if (filter === "Contact ✓" && !c.contact_verified) return false;
      if (filter === "Portfolio ✓" && !c.portfolio_verified) return false;
      return true;
    });
  }, [companies, q, area, filter]);

  const toggle = (id: string, field: "contact_verified" | "portfolio_verified", current: boolean) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: !current } : c)));
    startTransition(async () => {
      const ok = await adminUpdateCompany(adminKey, id, field, String(!current));
      if (!ok) setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: current } : c)));
    });
  };

  const saveField = (id: string, field: "email" | "ops_notes", value: string) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value || null } : c)));
    startTransition(async () => {
      await adminUpdateCompany(adminKey, id, field, value);
    });
  };

  const stats = {
    contact: companies.filter((c) => c.contact_verified).length,
    portfolio: companies.filter((c) => c.portfolio_verified).length,
  };

  return (
    <div>
      <PageHeader
        title="Companies"
        desc={`${companies.length} listed · ${stats.contact} contact-verified · ${stats.portfolio} portfolio-verified`}
      />

      <Card className="mb-6">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setLimit(50); }}
          placeholder="Search by name…"
          className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
        />
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setLimit(50); }}
              className={`rounded-full border px-3 py-1 text-xs ${filter === f ? "border-walnut bg-walnut text-cream" : "border-gray-200 text-gray-600"}`}
            >
              {f}
            </button>
          ))}
          <span className="mx-2 h-4 w-px bg-gray-200" />
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => { setArea(area === a ? null : a); setLimit(50); }}
              className={`rounded-full border px-3 py-1 text-xs ${area === a ? "border-terracotta bg-terracotta-tint text-terracotta-deep" : "border-gray-200 text-gray-600"}`}
            >
              {a}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-2">
        {list.slice(0, limit).map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-bold">{c.name}</p>
                  {c.verified && <Badge tone="green">Claimed</Badge>}
                </div>
                <p className="text-xs text-gray-400">{c.area} · {(c.categories ?? []).slice(0, 2).join(" · ")}</p>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs text-gray-500">
                {c.phone && (
                  <>
                    <Phone className="h-3.5 w-3.5" /> {c.phone}
                    <a href={waLink(c.phone)} target="_blank" rel="noopener noreferrer"
                      className="ml-1 inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-2.5 py-1.5 font-sans font-bold text-white">
                      <MessageCircle className="h-3.5 w-3.5" /> WA
                    </a>
                  </>
                )}
                {c.website && (
                  <a href={c.website} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 font-sans text-gray-500 hover:border-gray-400">
                    <Globe className="h-3.5 w-3.5" /> Web
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggle(c.id, "contact_verified", c.contact_verified)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                    c.contact_verified ? "bg-emerald-500 text-cream" : "border border-gray-200 text-gray-500 hover:border-emerald-400"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" /> Contact
                </button>
                <button
                  onClick={() => toggle(c.id, "portfolio_verified", c.portfolio_verified)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                    c.portfolio_verified ? "bg-emerald-500 text-cream" : "border border-gray-200 text-gray-500 hover:border-emerald-400"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" /> Portfolio
                </button>
              </div>

              <input
                defaultValue={c.email ?? ""}
                onBlur={(e) => e.target.value !== (c.email ?? "") && saveField(c.id, "email", e.target.value)}
                placeholder="email@…"
                className="w-44 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs"
              />
            </div>
          </Card>
        ))}
      </div>

      {limit < list.length && (
        <div className="mt-6 text-center">
          <button onClick={() => setLimit((l) => l + 50)} className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm text-gray-600 hover:border-clay">
            Show more ({list.length - limit} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
