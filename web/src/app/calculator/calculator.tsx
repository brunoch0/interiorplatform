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

const SCOPES = ["Full renovation", "Kitchen + bathrooms", "Kitchen only", "Bathrooms only", "Cosmetic refresh (paint, flooring)"];

type Range = [number, number];
const mul = (r: Range, f: number): Range => [Math.round(r[0] * f), Math.round(r[1] * f)];
const add = (a: Range, b: Range): Range => [a[0] + b[0], a[1] + b[1]];
const round500 = (r: Range): Range => [Math.round(r[0] / 500) * 500, Math.round(r[1] / 500) * 500];

export default function CostCalculator() {
  const [unit, setUnit] = useState("2 Bedroom");
  const [scope, setScope] = useState(SCOPES[0]);
  const [finish, setFinish] = useState("Standard");
  const [baths, setBaths] = useState(2);
  const [sqft, setSqft] = useState("");
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const parts: { label: string; range: Range }[] = [];
    let total: Range = [0, 0];

    if (scope === "Full renovation") {
      const area = Number(sqft);
      if (area >= 200 && area <= 20000) {
        const rate = SQFT_RATE[finish];
        total = [area * rate[0], area * rate[1]];
        parts.push({ label: `Full renovation · ${fmt(area)} sqft × AED ${rate[0]}–${rate[1]}/sqft (${finish.toLowerCase()})`, range: total });
      } else {
        total = mul(UNIT_BASE[unit], FINISH_MULT[finish]);
        parts.push({ label: `Full renovation · ${unit} · ${finish.toLowerCase()} finish`, range: total });
      }
    } else if (scope === "Cosmetic refresh (paint, flooring)") {
      total = mul(mul(UNIT_BASE[unit], FINISH_MULT[finish]), 0.35);
      parts.push({ label: `Cosmetic refresh · ${unit} · ${finish.toLowerCase()} finish`, range: total });
    } else {
      if (scope === "Kitchen + bathrooms" || scope === "Kitchen only") {
        const k = KITCHEN[finish];
        parts.push({ label: `Kitchen · ${finish.toLowerCase()}`, range: k });
        total = add(total, k);
      }
      if (scope === "Kitchen + bathrooms" || scope === "Bathrooms only") {
        const b = mul(BATHROOM[finish], baths);
        parts.push({ label: `${baths} bathroom${baths > 1 ? "s" : ""} · ${finish.toLowerCase()}`, range: b });
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

  const needsBaths = scope === "Kitchen + bathrooms" || scope === "Bathrooms only";

  return (
    <div>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Property type</label>
            <select value={unit} onChange={(e) => { setUnit(e.target.value); setShowResult(false); }}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              {Object.keys(UNIT_BASE).map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">What do you want done?</label>
            <select value={scope} onChange={(e) => { setScope(e.target.value); setShowResult(false); }}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              {SCOPES.map((s) => <option key={s}>{s}</option>)}
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
          {needsBaths ? (
            <div>
              <label className="text-sm font-medium">How many bathrooms?</label>
              <select value={baths} onChange={(e) => { setBaths(Number(e.target.value)); setShowResult(false); }}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          ) : scope === "Full renovation" ? (
            <div>
              <label className="text-sm font-medium">Area in sqft <span className="font-normal text-gray-400">(optional — sharpens the range)</span></label>
              <input value={sqft} onChange={(e) => { setSqft(e.target.value.replace(/[^0-9]/g, "")); setShowResult(false); }}
                placeholder="e.g. 1200" inputMode="numeric"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </div>
          ) : null}
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
