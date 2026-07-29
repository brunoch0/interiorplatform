import DemoBanner from "@/components/demo-banner";
import { exposurePackages } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

export const metadata = { robots: { index: false, follow: false } };

export default function Packages() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <DemoBanner />
      <PageHeader
        title="Exposure Packages"
        desc="Benefits activate immediately on purchase. No auto-renewal — listings return to organic ranking on expiry."
      />
      <Notice tone="blue">
        Currently active: <b>Premium Boost</b> (2026-07-15 ~ 08-15). We&apos;ll remind you 3 days before and on the day of expiry.
      </Notice>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {exposurePackages.map((p, i) => (
          <Card key={p.id} className={i === 1 ? "ring-2 ring-amber-400" : ""}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{p.name}</h2>
              {i === 1 && <Badge tone="amber">Active</Badge>}
            </div>
            <p className="mt-3 text-3xl font-black">
              <span className="text-sm font-semibold text-gray-400">AED </span>{p.price}
              <span className="text-sm font-normal text-gray-400"> / {p.period}</span>
            </p>
            <ul className="mt-4 space-y-2 border-t border-gray-50 pt-4 text-sm text-gray-600">
              {p.benefits.map((b) => <li key={b}>✓ {b}</li>)}
            </ul>
            <button
              className={`mt-5 w-full rounded-xl py-3 text-sm font-bold ${
                i === 1 ? "bg-gray-100 text-gray-400" : "bg-walnut text-cream hover:bg-walnut-deep"
              }`}
              disabled={i === 1}
            >
              {i === 1 ? "Repurchase after expiry" : "Purchase"}
            </button>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Placement and duration are clearly shown before purchase; refunds follow the platform policy. Paid placements carry an &lsquo;Ad&rsquo; label and never affect quantitative trust metrics.
      </p>
    </div>
  );
}
