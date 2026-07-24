import Link from "next/link";
import type { ReactNode } from "react";

export function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "green" | "red" | "amber" | "blue" | "navy" }) {
  const tones: Record<string, string> = {
    gray: "bg-gray-100 text-gray-600",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
    navy: "bg-slate-900 text-white",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {desc && <p className="mt-1.5 text-sm text-gray-500">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, sub, tone = "default" }: { label: string; value: ReactNode; sub?: string; tone?: "default" | "good" | "bad" }) {
  const color = tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-red-600" : "text-slate-900";
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>}
    </div>
  );
}

export function MetricValue({ value, suffix = "" }: { value: number | null; suffix?: string }) {
  if (value === null) return <span className="text-sm text-gray-400">Insufficient data</span>;
  return <span>{value}{suffix}</span>;
}

export function Steps({ items, current }: { items: string[]; current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {items.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              i < current ? "bg-emerald-500 text-white" : i === current ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </span>
          <span className={`text-sm ${i === current ? "font-semibold text-slate-900" : "text-gray-500"}`}>{s}</span>
          {i < items.length - 1 && <span className="mx-1 h-px w-8 bg-gray-200" />}
        </li>
      ))}
    </ol>
  );
}

export function Placeholder({ label, ratio = "aspect-[4/3]", hue = 200 }: { label?: string; ratio?: string; hue?: number }) {
  return (
    <div
      className={`flex ${ratio} w-full items-center justify-center rounded-xl text-xs text-white/80`}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 30% 55%), hsl(${hue + 40} 35% 35%))` }}
    >
      {label}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-slate-900">
      ← {label}
    </Link>
  );
}

export function FileDrop({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center transition hover:border-slate-400">
      <span className="text-2xl">📄</span>
      <p className="mt-2 text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-xs text-gray-400">{hint ?? "PDF, JPG · max 10MB"}</p>
    </div>
  );
}

export function Notice({ tone = "amber", children }: { tone?: "amber" | "blue" | "red" | "green"; children: ReactNode }) {
  const tones: Record<string, string> = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-sky-200 bg-sky-50 text-sky-800",
    red: "border-red-200 bg-red-50 text-red-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };
  return <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${tones[tone]}`}>{children}</div>;
}
