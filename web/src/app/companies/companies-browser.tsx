"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/data";
import { fmt } from "@/lib/data";
import { Badge, Card, MetricValue, PageHeader, Placeholder } from "@/components/ui";

const PAGE = 30;
const spaceTypeOptions = ["Apartment", "Villa", "Commercial"];
const categoryOptions = ["Full Renovation", "Residential", "Commercial", "Villa Renovation", "Carpentry", "Kitchen", "Landscaping", "Smart Home"];

export default function CompaniesBrowser({ companies }: { companies: Company[] }) {
  const [q, setQ] = useState("");
  const [space, setSpace] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [limit, setLimit] = useState(PAGE);

  const areaOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of companies) counts.set(c.area, (counts.get(c.area) ?? 0) + 1);
    return [...counts.entries()]
      .filter(([a]) => a !== "Dubai")
      .sort((x, y) => y[1] - x[1])
      .slice(0, 8)
      .map(([a]) => a);
  }, [companies]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = companies.filter((c) => {
      if (needle && !c.name.toLowerCase().includes(needle)) return false;
      if (space && !c.spaceTypes.includes(space)) return false;
      if (area && c.area !== area) return false;
      if (category && !c.categories.includes(category)) return false;
      return true;
    });
    // Verified first → premium → schedule compliance → name
    list = [...list].sort((a, b) => {
      if (a.verified !== b.verified) return a.verified ? -1 : 1;
      const pa = a.exposurePackage === "premium" ? 1 : 0;
      const pb = b.exposurePackage === "premium" ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return (b.scheduleComplianceRate ?? -1) - (a.scheduleComplianceRate ?? -1);
    });
    return list;
  }, [companies, q, space, area, category]);

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 5 ? [...s, id] : s));

  const reset = () => {
    setQ("");
    setSpace(null);
    setArea(null);
    setCategory(null);
    setLimit(PAGE);
  };

  const FilterGroup = ({ label, options, value, onChange }: { label: string; options: string[]; value: string | null; onChange: (v: string | null) => void }) => (
    <div>
      <p className="mb-2 text-xs font-semibold text-gray-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => { onChange(value === o ? null : o); setLimit(PAGE); }}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              value === o ? "border-walnut bg-walnut text-cream" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  const visible = filtered.slice(0, limit);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Find Contractors"
        desc={`${fmt(companies.length)} licensed interior companies listed from public sources across Dubai.`}
        action={
          <button onClick={reset} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">
            Reset filters
          </button>
        }
      />

      <Card className="mb-8">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }}
          placeholder="Search by company name…"
          className="mb-5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <FilterGroup label="Space type" options={spaceTypeOptions} value={space} onChange={setSpace} />
          <FilterGroup label="Area" options={areaOptions} value={area} onChange={setArea} />
          <FilterGroup label="Specialty" options={categoryOptions} value={category} onChange={setCategory} />
        </div>
      </Card>

      <p className="mb-4 text-sm text-gray-500">
        <b className="text-charcoal">{fmt(filtered.length)}</b> contractors found
        {selected.length > 0 && <span className="ml-3 text-terracotta-deep">· {selected.length}/5 in quote basket</span>}
      </p>

      {filtered.length === 0 && (
        <Card className="mb-8 text-center">
          <p className="font-semibold">No contractors match your filters</p>
          <p className="mt-1 text-sm text-gray-500">Try removing a filter or adjusting your search.</p>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {visible.map((c, i) => (
          <Card key={c.id} className="relative">
            <div className="flex gap-4">
              <div className="w-24 shrink-0">
                <Placeholder label="" ratio="aspect-square" hue={i} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/companies/${c.id}`} className="font-bold hover:underline">{c.name}</Link>
                  {c.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="gray">Unclaimed</Badge>}
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-400">
                  {c.area} · {c.categories.slice(0, 3).join(" · ") || "Interior"}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-gray-50 py-2">
                    <p className="text-sm font-bold text-emerald-600"><MetricValue value={c.scheduleComplianceRate} suffix="%" /></p>
                    <p className="text-[10px] text-gray-400">on schedule</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 py-2">
                    <p className="text-sm font-bold"><MetricValue value={c.noExtraChargeRate} suffix="%" /></p>
                    <p className="text-[10px] text-gray-400">no extra charges</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 py-2">
                    <p className="text-sm font-bold font-mono">{fmt(c.verifiedReviewCount)}</p>
                    <p className="text-[10px] text-gray-400">verified reviews</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
              <Link href={`/companies/${c.id}`} className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-sm font-medium hover:border-gray-400">
                View profile
              </Link>
              {c.verified ? (
                <button
                  onClick={() => toggleSelect(c.id)}
                  className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                    selected.includes(c.id) ? "bg-terracotta text-cream" : "bg-walnut text-cream hover:bg-walnut-deep"
                  }`}
                >
                  {selected.includes(c.id) ? "✓ Added" : "Add to quote basket"}
                </button>
              ) : (
                <Link href="/supplier/license" className="flex-1 rounded-lg bg-gray-100 py-2 text-center text-sm font-bold text-gray-500 hover:bg-gray-200">
                  Claim this profile
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>

      {limit < filtered.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setLimit((l) => l + PAGE)}
            className="rounded-xl border border-gray-300 bg-cream px-8 py-3 text-sm font-semibold text-charcoal hover:border-clay"
          >
            Show more ({fmt(filtered.length - limit)} remaining)
          </button>
        </div>
      )}

      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-[rgba(255,253,249,0.92)] py-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
            <p className="text-sm">
              <b className="text-terracotta-deep">{selected.length}</b> contractors selected (max 5)
            </p>
            <Link href="/quote" className="rounded-xl bg-terracotta px-8 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep">
              Request quotes →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
