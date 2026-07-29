"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Guide } from "@/lib/guides";
import { guideImage } from "@/lib/guide-images";
import { Card } from "@/components/ui";

// Renovation-journey order — mirrors the stages a homeowner moves through
export const CATEGORY_ORDER = [
  "Planning & Costs",
  "Permits & Rules",
  "Hiring & Contracts",
  "During the Works",
  "Handover & Quality",
  "Problems & Rights",
];

type GuideCard = Pick<Guide, "slug" | "title" | "description" | "updated" | "readMinutes" | "category">;

export default function GuidesBrowser({ guides }: { guides: GuideCard[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const cats = useMemo(() => {
    const present = new Set(guides.map((g) => g.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, [guides]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return guides.filter((g) => {
      if (cat && g.category !== cat) return false;
      if (needle && !`${g.title} ${g.description}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [guides, q, cat]);

  const grouped = useMemo(() => {
    const byCat = new Map<string, GuideCard[]>();
    for (const g of filtered) {
      if (!byCat.has(g.category)) byCat.set(g.category, []);
      byCat.get(g.category)!.push(g);
    }
    return CATEGORY_ORDER.filter((c) => byCat.has(c)).map((c) => ({ category: c, items: byCat.get(c)! }));
  }, [filtered]);

  return (
    <div>
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search guides — costs, permits, delays, snagging…"
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCat(null)}
            className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
              cat === null ? "border-walnut bg-walnut text-cream" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            All ({guides.length})
          </button>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(cat === c ? null : c)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                cat === c ? "border-walnut bg-walnut text-cream" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              {c} ({guides.filter((g) => g.category === c).length})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <Card className="text-center text-sm text-gray-500">
          Nothing matches — try a different word, or <Link href="/consult" className="font-semibold text-terracotta-deep underline">ask the assistant directly</Link>.
        </Card>
      )}

      <div className="space-y-10">
        {grouped.map(({ category, items }) => (
          <section key={category}>
            <div className="mb-4 flex items-baseline gap-3">
              <h2 className="font-serif text-xl font-semibold text-walnut">{category}</h2>
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">{items.length} guide{items.length > 1 ? "s" : ""}</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="group">
                  <Card className="h-full overflow-hidden p-0 transition hover:shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={guideImage(g.slug, g.category, 640)}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="p-5">
                      <p className="text-xs text-gray-400">{g.readMinutes} min read · updated {g.updated}</p>
                      <h3 className="mt-2 text-lg font-bold leading-snug">{g.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">{g.description}</p>
                      <p className="mt-3 text-sm font-semibold text-terracotta-deep">Read guide →</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
