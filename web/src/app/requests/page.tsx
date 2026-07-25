import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, MapPin } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL, timeAgo } from "@/lib/site";
import { Badge, Card, PageHeader } from "@/components/ui";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Open Renovation Projects in Dubai — Quote Real Briefs",
  description:
    "Live renovation briefs posted by Dubai homeowners: area, scope, budget band and timeline. Licensed contractors can submit a quote on any open project — free.",
  alternates: { canonical: `${SITE_URL}/requests` },
};

type OpenRequest = {
  id: string;
  ref: string;
  area: string | null;
  space_type: string | null;
  budget: string | null;
  timeline: string | null;
  type: string;
  created_at: string;
  scope: string;
  bid_count: number;
};

async function fetchOpenRequests(): Promise<OpenRequest[]> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await supabase.rpc("public_open_requests");
  return (data as OpenRequest[] | null) ?? [];
}

export default async function RequestsBoard() {
  const requests = await fetchOpenRequests();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        title="Open Projects"
        desc="Real renovation briefs from Dubai homeowners, posted anonymously. Submit a quote on any brief that matches your trade — free while we're in early access."
      />

      <p className="mb-6 rounded-xl bg-sand p-4 text-xs leading-relaxed text-gray-500">
        Homeowner contact details are never shown. Submit your quote and our team passes it on — the homeowner replies
        through us. <Link href="/supplier/license" className="font-semibold text-terracotta-deep underline">Verified contractors</Link> get
        priority placement.
      </p>

      {requests.length === 0 && (
        <Card className="text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-clay" strokeWidth={1.5} />
          <p className="mt-3 font-semibold">No open briefs right now</p>
          <p className="mt-1 text-sm text-gray-500">
            New requests arrive through our consultation flow daily and are matched via concierge first.
            Check back soon — or <Link href="/supplier/license" className="font-semibold text-terracotta-deep underline">claim your profile</Link> to
            be shortlisted directly.
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {requests.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-gray-400">{r.ref}</span>
              {r.space_type && <Badge tone="blue">{r.space_type}</Badge>}
              {r.budget && <Badge tone="gray">{r.budget}</Badge>}
              {r.timeline && <Badge tone="gray">{r.timeline}</Badge>}
              <span className="ml-auto text-xs text-gray-400">{timeAgo(r.created_at)}</span>
            </div>
            {r.area && (
              <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="h-3.5 w-3.5" /> {r.area}
              </p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{r.scope}</p>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-400">
                {r.bid_count > 0 ? `${r.bid_count} quote${r.bid_count > 1 ? "s" : ""} submitted` : "No quotes yet — be first"}
              </span>
              <Link href={`/requests/${r.id}`} className="rounded-lg bg-walnut px-5 py-2 text-sm font-bold text-cream hover:bg-walnut-deep">
                Submit a quote
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        Are you a homeowner? <Link href="/consult" className="font-semibold text-terracotta-deep underline">Post your project in 2 minutes →</Link>
      </p>
    </div>
  );
}
