import { createClient } from "@supabase/supabase-js";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

type LeadCompany = { id: string; name: string; area: string | null; phone: string | null; website: string | null };
type Lead = {
  id: string; ref: string; name: string; phone: string | null; email: string | null;
  space_type: string | null; area: string | null; budget: string | null; timeline: string | null;
  details: string | null; status: string; created_at: string; companies: LeadCompany[] | null;
  type: string; brief: Record<string, string> | null;
  transcript: { role: string; content: string; images?: string[] }[] | null;
  is_public: boolean; bids: {
    id: string; company_name: string; contact_name: string | null; email: string; phone: string | null;
    price_band: string | null; timeline: string | null; message: string | null; status: string; created_at: string;
  }[] | null;
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
              {l.type === "consultation" && <Badge tone="amber">AI consult</Badge>}
              {l.is_public && <Badge tone="green">On board</Badge>}
              {(l.bids?.length ?? 0) > 0 && <Badge tone="blue">{l.bids!.length} bid{l.bids!.length > 1 ? "s" : ""}</Badge>}
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
            {l.details && <p className="mt-3 whitespace-pre-line rounded-xl bg-gray-50 p-3 text-sm text-gray-600">{l.details}</p>}
            {l.bids && l.bids.length > 0 && (
              <div className="mt-3 rounded-xl border border-terracotta/30 bg-terracotta-tint/40 p-3">
                <p className="text-xs font-bold text-terracotta-deep">Contractor bids — relay to homeowner</p>
                <div className="mt-2 space-y-2">
                  {l.bids.map((b) => (
                    <div key={b.id} className="rounded-lg bg-white p-3 text-xs">
                      <p>
                        <b>{b.company_name}</b>
                        {b.price_band && <span className="ml-2 font-mono">{b.price_band}</span>}
                        {b.timeline && <span className="ml-2 text-gray-500">{b.timeline}</span>}
                        <span className="ml-2 text-gray-400">{new Date(b.created_at).toLocaleString("en-GB", { timeZone: "Asia/Dubai" })}</span>
                      </p>
                      <p className="mt-1 font-mono text-gray-500">
                        {b.contact_name && <>{b.contact_name} · </>}{b.email}{b.phone && <> · {b.phone}</>}
                      </p>
                      {b.message && <p className="mt-1 text-gray-600">{b.message}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {l.transcript && l.transcript.length > 0 && (
              <details className="mt-3 rounded-xl border border-gray-100 p-3">
                <summary className="cursor-pointer text-xs font-semibold text-gray-500">
                  AI conversation transcript ({l.transcript.length} messages)
                </summary>
                <div className="mt-3 space-y-2">
                  {l.transcript.map((m, i) => (
                    <div key={i} className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${m.role === "user" ? "bg-terracotta-tint text-terracotta-deep" : "bg-gray-50 text-gray-600"}`}>
                      <b className="mr-1 uppercase text-[10px] opacity-60">{m.role === "user" ? "Customer" : "AI"}</b>
                      {m.content}
                      {m.images && m.images.length > 0 && (
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {m.images.map((u) => (
                            <a key={u} href={u} target="_blank" rel="noopener noreferrer">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={u} alt="" className="h-20 w-20 rounded-lg object-cover" />
                            </a>
                          ))}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
