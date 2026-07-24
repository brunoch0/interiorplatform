import Link from "next/link";
import { FileText } from "lucide-react";
import type { ReactNode } from "react";

export function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "green" | "red" | "amber" | "blue" | "navy" }) {
  const tones: Record<string, string> = {
    gray: "bg-gray-100 text-gray-600",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
    navy: "bg-walnut text-cream",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-gray-200 bg-cream p-6 shadow-sm transition-shadow ${className}`}>{children}</div>;
}

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl text-charcoal">{title}</h1>
        {desc && <p className="mt-1.5 text-sm text-gray-500">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, sub, tone = "default" }: { label: string; value: ReactNode; sub?: string; tone?: "default" | "good" | "bad" }) {
  const color = tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-red-600" : "text-charcoal";
  return (
    <div className="rounded-2xl border border-gray-200 bg-cream p-4 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 font-mono text-xl font-semibold ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>}
    </div>
  );
}

export function MetricValue({ value, suffix = "" }: { value: number | null; suffix?: string }) {
  if (value === null) return <span className="font-sans text-sm text-gray-400">Insufficient data</span>;
  return <span className="font-mono">{value}{suffix}</span>;
}

export function Steps({ items, current }: { items: string[]; current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {items.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              i < current ? "bg-emerald-500 text-cream" : i === current ? "bg-walnut text-cream" : "bg-gray-200 text-gray-500"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </span>
          <span className={`text-sm ${i === current ? "font-semibold text-charcoal" : "text-gray-500"}`}>{s}</span>
          {i < items.length - 1 && <span className="mx-1 h-px w-8 bg-gray-300" />}
        </li>
      ))}
    </ol>
  );
}

// Imagery placeholder — warm sand→taupe gradient per brand (no cool hues)
export function Placeholder({ label, ratio = "aspect-[4/3]", hue }: { label?: string; ratio?: string; hue?: number }) {
  const warm = ((hue ?? 0) % 5) * 6; // subtle warm variation only
  return (
    <div
      className={`flex ${ratio} w-full items-center justify-center rounded-xl text-xs tracking-widest text-cream/90`}
      style={{ background: `linear-gradient(135deg, hsl(${34 - warm / 4} 30% ${72 - warm / 3}%), hsl(${26 - warm / 4} 26% ${46 - warm / 3}%))` }}
    >
      {label}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-terracotta-deep">
      ← {label}
    </Link>
  );
}

export function FileDrop({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition hover:border-clay">
      <FileText className="h-6 w-6 text-clay" strokeWidth={1.75} />
      <p className="mt-2 text-sm font-medium text-charcoal">{label}</p>
      <p className="mt-1 text-xs text-gray-400">{hint ?? "PDF, JPG · max 10MB"}</p>
    </div>
  );
}

export function Notice({ tone = "amber", children }: { tone?: "amber" | "blue" | "red" | "green"; children: ReactNode }) {
  const tones: Record<string, string> = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-sky-200 bg-sky-50 text-sky-700",
    red: "border-red-200 bg-red-50 text-red-700",
    green: "border-emerald-50 bg-emerald-50 text-emerald-700",
  };
  return <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${tones[tone]}`}>{children}</div>;
}
