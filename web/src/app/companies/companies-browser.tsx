"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Company } from "@/lib/data";
import { fmt } from "@/lib/data";
import { Badge, Card, MetricValue, PageHeader, Placeholder } from "@/components/ui";

const PAGE = 30;
const spaceTypeOptions = ["Apartment", "Villa", "Commercial"];

export const companyPhotoUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${path}`;

export const mapsUrl = (name: string, placeId: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${placeId}`;

export function GoogleRating({ rating, count, size = "sm", href }: { rating: number; count: number; size?: "sm" | "lg"; href?: string }) {
  const inner = (
    <>
      <Star className={`${size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"} fill-amber-400 text-amber-400`} strokeWidth={1.5} />
      <b className="font-mono text-charcoal">{rating.toFixed(1)}</b>
      <span className="text-gray-400">({fmt(count)} review{count === 1 ? "" : "s"} on Google)</span>
    </>
  );
  const cls = `inline-flex items-center gap-1.5 ${size === "lg" ? "text-sm" : "text-xs"}`;
  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:underline`} onClick={(e) => e.stopPropagation()}>
        {inner}
      </a>
    );
  return <span className={cls}>{inner}</span>;
}

export default function CompaniesBrowser({ companies }: { companies: Company[] }) {
  const [q, setQ] = useState("");
  const [space, setSpace] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [limit, setLimit] = useState(PAGE);
  const [allAreas, setAllAreas] = useState(false);
  const [allCats, setAllCats] = useState(false);

  const areaOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of companies) counts.set(c.area, (counts.get(c.area) ?? 0) + 1);
    return [...counts.entries()]
      .filter(([a]) => a !== "Dubai")
      .sort((x, y) => y[1] - x[1])
      .map(([a]) => a);
  }, [companies]);

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of companies) for (const cat of c.categories) counts.set(cat, (counts.get(cat) ?? 0) + 1);
    return [...counts.entries()].sort((x, y) => y[1] - x[1]).map(([cat]) => cat);
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
    // Verification ladder ranking: claimed → portfolio ✓ → contact ✓ → rest
    const score = (c: Company) =>
      (c.verified ? 8 : 0) + (c.portfolioVerified ? 4 : 0) + (c.contactVerified ? 2 : 0) +
      (c.exposurePackage === "premium" ? 1 : 0);
    // Within the same ladder tier, rank by Google rating weighted by review volume
    const gScore = (c: Company) => (c.googleRating ?? 0) * Math.log1p(c.googleRatingCount ?? 0);
    list = [...list].sort((a, b) => {
      const d = score(b) - score(a);
      if (d !== 0) return d;
      const g = gScore(b) - gScore(a);
      if (g !== 0) return g;
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

  const FilterGroup = ({ label, options, value, onChange, expanded, onExpand, collapsedCount = 8 }: {
    label: string; options: string[]; value: string | null; onChange: (v: string | null) => void;
    expanded?: boolean; onExpand?: (v: boolean) => void; collapsedCount?: number;
  }) => {
    const shown = expanded || !onExpand ? options : options.slice(0, collapsedCount);
    return (
      <div>
        <p className="mb-2 text-xs font-semibold text-gray-500">{label}</p>
        <div className="flex flex-wrap gap-1.5">
          {shown.map((o) => (
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
          {onExpand && options.length > collapsedCount && (
            <button
              onClick={() => onExpand(!expanded)}
              className="rounded-full border border-dashed border-clay px-3 py-1 text-xs text-clay hover:bg-sand"
            >
              {expanded ? "Show less" : `+${options.length - collapsedCount} more`}
            </button>
          )}
        </div>
      </div>
    );
  };

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
        <div className="space-y-5">
          <FilterGroup label="Space type" options={spaceTypeOptions} value={space} onChange={setSpace} />
          <FilterGroup label="Area" options={areaOptions} value={area} onChange={setArea} expanded={allAreas} onExpand={setAllAreas} collapsedCount={10} />
          <FilterGroup label="Specialty" options={categoryOptions} value={category} onChange={setCategory} expanded={allCats} onExpand={setAllCats} collapsedCount={10} />
        </div>
      </Card>

      <p className="mb-1 text-sm text-gray-500">
        <b className="text-charcoal">{fmt(filtered.length)}</b> contractors found
        {selected.length > 0 && <span className="ml-3 text-terracotta-deep">· {selected.length}/5 in quote basket</span>}
      </p>
      <p className="mb-4 text-xs text-gray-400">Star ratings and review counts are from Google Maps, refreshed monthly.</p>

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
              <div className="w-24 shrink-0 overflow-hidden rounded-xl">
                {c.photoPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={companyPhotoUrl(c.photoPath)} alt={c.name} loading="lazy" className="aspect-square w-full object-cover" />
                ) : (
                  <Placeholder label="" ratio="aspect-square" hue={i} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/companies/${c.id}`} className="font-bold hover:underline">{c.name}</Link>
                  {c.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="gray">Unclaimed</Badge>}
                  {c.contactVerified && <Badge tone="blue">✓ Contact</Badge>}
                  {c.portfolioVerified && <Badge tone="blue">✓ Portfolio</Badge>}
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {c.googleRating != null && c.googleRatingCount != null ? (
                    <GoogleRating rating={c.googleRating} count={c.googleRatingCount}
                      href={c.placeId ? mapsUrl(c.name, c.placeId) : undefined} />
                  ) : (
                    <span>{c.area} · Licensed interior company</span>
                  )}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <Badge tone="gray">{c.area}</Badge>
                  {c.categories.slice(0, 3).map((cat) => (
                    <Badge key={cat} tone="blue">{cat}</Badge>
                  ))}
                </div>
                {c.scheduleComplianceRate != null && (
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
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
              <Link href={`/companies/${c.id}`} className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-sm font-medium hover:border-gray-400">
                View profile
              </Link>
              <button
                onClick={() => toggleSelect(c.id)}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                  selected.includes(c.id) ? "bg-terracotta text-cream" : "bg-walnut text-cream hover:bg-walnut-deep"
                }`}
              >
                {selected.includes(c.id) ? "✓ Added" : "Add to quote basket"}
              </button>
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
            <Link href={`/quote?c=${selected.join(",")}`} className="rounded-xl bg-terracotta px-8 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep">
              Request quotes →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
