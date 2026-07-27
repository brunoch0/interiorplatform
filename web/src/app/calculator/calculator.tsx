"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator as CalcIcon, MessageCircle } from "lucide-react";
import { fmt } from "@/lib/data";
import { Card } from "@/components/ui";
import EmailCapture from "@/components/email-capture";

// Ranges mirror the published cost guides (apartment/villa/kitchen-bathroom) — keep in sync
const UNIT_BASE: Record<string, [number, number]> = {
  "Studio": [25000, 60000],
  "1 Bedroom": [60000, 100000],
  "2 Bedroom": [100000, 180000],
  "3 Bedroom": [150000, 250000],
  "4 Bedroom+": [220000, 350000],
  "Villa / Townhouse": [300000, 600000],
};
const SQFT_RATE: Record<string, [number, number]> = {
  "Budget": [80, 150],
  "Standard": [150, 250],
  "Premium": [250, 400],
};
const FINISH_MULT: Record<string, number> = { Budget: 0.7, Standard: 1, Premium: 1.7 };
const KITCHEN: Record<string, [number, number]> = {
  Budget: [10000, 20000],
  Standard: [18000, 35000],
  Premium: [60000, 120000],
};
const BATHROOM: Record<string, [number, number]> = {
  Budget: [9000, 16000],
  Standard: [15000, 30000],
  Premium: [35000, 70000],
};
// Whole-unit repaint (walls + ceilings, standard emulsion at Standard tier)
const PAINT_BASE: Record<string, [number, number]> = {
  "Studio": [2500, 5000],
  "1 Bedroom": [3500, 7000],
  "2 Bedroom": [5000, 10000],
  "3 Bedroom": [7000, 14000],
  "4 Bedroom+": [9000, 18000],
  "Villa / Townhouse": [15000, 35000],
};

// Ordered by depth — the price gap between gut and paint-only is ~20x, so the scope choice matters most
const SCOPE_DEFS = [
  { key: "gut", label: "Full gut renovation", desc: "Strip to shell: demolition, layout changes, new MEP, everything rebuilt" },
  { key: "full", label: "Full renovation (keep layout)", desc: "New flooring, kitchen, bathrooms, paint, lighting — walls stay where they are" },
  { key: "kb", label: "Kitchen + bathrooms", desc: "Wet areas only — the two most expensive rooms" },
  { key: "kitchen", label: "Kitchen only", desc: "Cabinetry, counters, appliances hookup" },
  { key: "bath", label: "Bathrooms only", desc: "Retile, refit, waterproofing" },
  { key: "refresh", label: "Flooring + paint refresh", desc: "Cosmetic only — no tiles, no MEP, no demolition" },
  { key: "paint", label: "Painting only", desc: "Whole unit repaint, walls and ceilings" },
] as const;
type ScopeKey = (typeof SCOPE_DEFS)[number]["key"];

type Range = [number, number];
const mul = (r: Range, f: number): Range => [Math.round(r[0] * f), Math.round(r[1] * f)];
const add = (a: Range, b: Range): Range => [a[0] + b[0], a[1] + b[1]];
const round500 = (r: Range): Range => [Math.round(r[0] / 500) * 500, Math.round(r[1] / 500) * 500];

export default function CostCalculator() {
  const [unit, setUnit] = useState("2 Bedroom");
  const [scope, setScope] = useState<ScopeKey>("full");
  const [finish, setFinish] = useState("Standard");
  const [baths, setBaths] = useState(2);
  const [sqft, setSqft] = useState("");
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const parts: { label: string; range: Range }[] = [];
    let total: Range = [0, 0];
    const fin = finish.toLowerCase();
    // Gut renovation: demolition, layout changes and full MEP re-do add ~30% over a keep-layout full reno
    const GUT = 1.3;

    if (scope === "full" || scope === "gut") {
      const area = Number(sqft);
      const depth = scope === "gut" ? GUT : 1;
      const depthLabel = scope === "gut" ? "Full gut renovation" : "Full renovation (keep layout)";
      if (area >= 200 && area <= 20000) {
        const rate = SQFT_RATE[finish];
        total = mul([area * rate[0], area * rate[1]], depth);
        parts.push({ label: `${depthLabel} · ${fmt(area)} sqft × AED ${rate[0]}–${rate[1]}/sqft (${fin})${scope === "gut" ? " × 1.3 demolition & MEP" : ""}`, range: total });
      } else {
        total = mul(UNIT_BASE[unit], FINISH_MULT[finish] * depth);
        parts.push({ label: `${depthLabel} · ${unit} · ${fin} finish`, range: total });
      }
    } else if (scope === "refresh") {
      total = mul(mul(UNIT_BASE[unit], FINISH_MULT[finish]), 0.35);
      parts.push({ label: `Flooring + paint refresh · ${unit} · ${fin} finish`, range: total });
    } else if (scope === "paint") {
      total = mul(PAINT_BASE[unit], FINISH_MULT[finish]);
      parts.push({ label: `Whole-unit repaint · ${unit} · ${fin} paint grade`, range: total });
    } else {
      if (scope === "kb" || scope === "kitchen") {
        const k = KITCHEN[finish];
        parts.push({ label: `Kitchen · ${fin}`, range: k });
        total = add(total, k);
      }
      if (scope === "kb" || scope === "bath") {
        const b = mul(BATHROOM[finish], baths);
        parts.push({ label: `${baths} bathroom${baths > 1 ? "s" : ""} · ${fin}`, range: b });
        total = add(total, b);
      }
    }
    return { parts, total: round500(total) };
  }, [unit, scope, finish, baths, sqft]);

  const calculate = () => {
    setShowResult(true);
    // GA4 event — which scopes/budgets people actually explore
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.("event", "calculate_estimate", {
      unit, scope, finish, estimate_low: result.total[0], estimate_high: result.total[1],
    });
  };

  const needsBaths = scope === "kb" || scope === "bath";
  const needsSqft = scope === "full" || scope === "gut";

  return (
    <div>
      <Card>
        <label className="text-sm font-medium">How deep does the work go?</label>
        <p className="mt-0.5 text-xs text-gray-400">This is the biggest price lever — a gut renovation and a repaint differ by 20×.</p>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {SCOPE_DEFS.map((s) => (
            <button key={s.key} type="button" onClick={() => { setScope(s.key); setShowResult(false); }}
              className={`rounded-xl border px-4 py-2.5 text-left transition ${
                scope === s.key ? "border-walnut bg-walnut text-cream" : "border-gray-200 hover:border-gray-400"
              }`}>
              <span className="block text-sm font-semibold">{s.label}</span>
              <span className={`block text-[11px] leading-snug ${scope === s.key ? "text-cream/70" : "text-gray-400"}`}>{s.desc}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Property type</label>
            <select value={unit} onChange={(e) => { setUnit(e.target.value); setShowResult(false); }}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              {Object.keys(UNIT_BASE).map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Finish level</label>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {Object.keys(FINISH_MULT).map((f) => (
                <button key={f} type="button" onClick={() => { setFinish(f); setShowResult(false); }}
                  className={`rounded-xl border px-3 py-3 text-sm transition ${
                    finish === f ? "border-walnut bg-walnut font-semibold text-cream" : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          {needsBaths && (
            <div>
              <label className="text-sm font-medium">How many bathrooms?</label>
              <select value={baths} onChange={(e) => { setBaths(Number(e.target.value)); setShowResult(false); }}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}
          {needsSqft && (
            <div>
              <label className="text-sm font-medium">Area in sqft <span className="font-normal text-gray-400">(optional — sharpens the range)</span></label>
              <input value={sqft} onChange={(e) => { setSqft(e.target.value.replace(/[^0-9]/g, "")); setShowResult(false); }}
                placeholder="e.g. 1200" inputMode="numeric"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </div>
          )}
        </div>

        <button onClick={calculate}
          className="mt-5 w-full rounded-xl bg-terracotta py-3.5 text-sm font-bold text-cream transition hover:bg-terracotta-deep">
          <CalcIcon className="mr-2 inline h-4 w-4" strokeWidth={2} /> Calculate my range
        </button>
      </Card>

      {showResult && (
        <>
          <Card className="mt-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">Your planning range</p>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              AED {fmt(result.total[0])} – {fmt(result.total[1])}
            </p>
            <div className="mx-auto mt-4 max-w-md space-y-1.5 text-left">
              {result.parts.map((p) => (
                <div key={p.label} className="flex items-baseline justify-between gap-4 rounded-lg bg-gray-50 px-3 py-2 text-xs">
                  <span className="text-gray-500">{p.label}</span>
                  <span className="shrink-0 font-mono text-gray-700">AED {fmt(p.range[0])}–{fmt(p.range[1])}</span>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-gray-400">
              Planning range from quoted Dubai projects, not a quote. Wet work (kitchens, bathrooms), layout changes
              and imported materials push you toward the top of the range. Quotes far below it usually exclude scope.
            </p>
          </Card>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link href="/quote" className="rounded-xl bg-walnut px-6 py-4 text-center text-sm font-bold text-cream transition hover:bg-walnut-deep">
              Get real quotes for this scope — free
            </Link>
            <Link href="/consult" className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-4 text-center text-sm font-semibold text-charcoal transition hover:border-clay">
              <MessageCircle className="h-4 w-4 text-terracotta-deep" /> Not sure about scope? Free consult
            </Link>
          </div>

          <div className="mt-8">
            <EmailCapture source="calculator" />
          </div>
        </>
      )}
    </div>
  );
}
