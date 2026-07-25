import { createClient } from "@supabase/supabase-js";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

type LeadCompany = { id: string; name: string; area: string | null; phone: string | null; website: string | null };
type Lead = {
  id: string; ref: string; name: string; phone: string | null; email: string | null;
  space_type: string | null; area: string | null; budget: string | null; timeline: string | null;
  details: string | null; status: string; created_at: string; companies: LeadCompany[] | null;
};

async function fetchLeads(key: string): Promise<Lead[] | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data, error } = await supabase.rpc("admin_list_leads", { p_key: key });
  if (error) return null;
  return data as Lead[] | null;
}

export default async function AdminLeads({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const { cookies } = await import("next/headers");
  const cookieKey = (await cookies()).get("ops_key")?.value;
  const adminKey = process.env.LEADS_ADMIN_KEY;
  const provided = key ?? cookieKey;
  const authorized = !!provided && !!adminKey && provided === adminKey;
  const leads = authorized ? await fetchLeads(provided!) : null;

  if (!authorized || leads === null)
    return (
      <div>
        <PageHeader title="Leads" desc="Incoming quote requests (live)" />
        <Notice tone="amber">
          Access key required. Open this page as <code>/admin/leads?key=YOUR_KEY</code> — the key is in your Vercel env
          (<code>LEADS_ADMIN_KEY</code>). Bookmark the full URL.
        </Notice>
      </div>
    );

  return (
    <div>
      <PageHeader title="Leads" desc={`${leads.length} quote request${leads.length === 1 ? "" : "s"} · live from Supabase`} />
      {leads.length === 0 && (
        <Card className="text-center text-sm text-gray-500">No quote requests yet. Share the site — they&apos;ll land here instantly.</Card>
      )}
      <div className="space-y-4">
        {leads.map((l) => (
          <Card key={l.id}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold">{l.ref}</span>
              <Badge tone={l.status === "new" ? "blue" : "gray"}>{l.status}</Badge>
              <span className="ml-auto text-xs text-gray-400">{new Date(l.created_at).toLocaleString("en-GB", { timeZone: "Asia/Dubai" })} (Dubai)</span>
            </div>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Contact</p>
                <p className="mt-1 font-semibold">{l.name}</p>
                {l.phone && <p className="font-mono text-xs">{l.phone}</p>}
                {l.email && <p className="font-mono text-xs">{l.email}</p>}
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Project</p>
                <p className="mt-1">{[l.space_type, l.area, l.budget, l.timeline].filter(Boolean).join(" · ") || "—"}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Selected contractors</p>
                {l.companies?.length ? (
                  <ul className="mt-1 space-y-1">
                    {l.companies.map((c) => (
                      <li key={c.id} className="text-xs">
                        <b>{c.name}</b> · {c.area}{c.phone && <span className="font-mono"> · {c.phone}</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">None — needs manual shortlist</p>
                )}
              </div>
            </div>
            {l.details && <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">{l.details}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
