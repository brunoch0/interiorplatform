import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { fetchCompanies } from "@/lib/db";
import { SITE_URL, timeAgo } from "@/lib/site";
import { Badge, BackLink, Card } from "@/components/ui";
import BidForm from "./bid-form";

export const dynamic = "force-dynamic";

type OpenRequestDetail = {
  id: string;
  ref: string;
  area: string | null;
  space_type: string | null;
  budget: string | null;
  timeline: string | null;
  type: string;
  created_at: string;
  scope: string;
  style: string | null;
  household: string | null;
  occupied: string | null;
  bid_count: number;
};

async function fetchRequest(id: string): Promise<OpenRequestDetail | null> {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await supabase.rpc("public_open_request", { p_id: id });
  return (data as OpenRequestDetail | null) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const r = await fetchRequest(id);
  if (!r) return {};
  const title = `${r.space_type ?? "Renovation"} brief in ${r.area ?? "Dubai"} — Open for Quotes (${r.ref})`;
  return {
    title,
    description: r.scope.slice(0, 160),
    alternates: { canonical: `${SITE_URL}/requests/${id}` },
  };
}

export default async function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [r, companies] = await Promise.all([fetchRequest(id), fetchCompanies()]);
  if (!r) notFound();

  const companyOpts = companies.map((c) => ({ id: c.id, name: c.name, area: c.area }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <BackLink href="/requests" label="All open projects" />

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-gray-400">{r.ref}</span>
          {r.space_type && <Badge tone="blue">{r.space_type}</Badge>}
          {r.budget && <Badge tone="gray">{r.budget}</Badge>}
          {r.timeline && <Badge tone="gray">{r.timeline}</Badge>}
          <span className="ml-auto text-xs text-gray-400">Posted {timeAgo(r.created_at)}</span>
        </div>
        {r.area && (
          <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" /> {r.area}
          </p>
        )}
        <p className="mt-3 rounded-xl bg-sand p-4 text-sm leading-relaxed text-gray-700">{r.scope}</p>
        <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
          {[["Style", r.style], ["Household", r.household], ["Living there during works", r.occupied]]
            .filter(([, v]) => v && v !== "unknown")
            .map(([k, v]) => (
              <div key={k} className="rounded-lg bg-gray-50 px-3 py-2">
                <dt className="text-gray-400">{k}</dt>
                <dd className="mt-0.5 text-gray-700">{v}</dd>
              </div>
            ))}
        </dl>
        <p className="mt-3 text-xs text-gray-400">
          {r.bid_count > 0 ? `${r.bid_count} quote${r.bid_count > 1 ? "s" : ""} submitted so far.` : "No quotes yet — be the first."}{" "}
          Homeowner identity and contacts are held by the platform.
        </p>
      </Card>

      <BidForm requestId={r.id} companies={companyOpts} />

      <p className="mt-6 text-center text-xs text-gray-400">
        Not listed in our directory yet?{" "}
        <Link href="/supplier/license" className="font-semibold text-terracotta-deep underline">Claim or create your profile →</Link>
      </p>
    </div>
  );
}
