import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { fmt } from "@/lib/data";
import { Card, Notice, PageHeader, Stat } from "@/components/ui";

export const dynamic = "force-dynamic";

type Dashboard = {
  leads_total: number; leads_new: number; leads_today: number;
  consultations: number; quotes: number; on_board: number;
  bids_total: number; bids_new: number;
  claims_pending: number; disputes_open: number;
  showcases_pending: number; showcases_live: number;
  companies_total: number; companies_verified: number; companies_contact: number;
  subscribers_total: number; subscribers_by_source: Record<string, number>;
  users_total: number; consult_calls_today: number;
};

async function fetchDashboard(key: string): Promise<Dashboard | null> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data, error } = await supabase.rpc("admin_dashboard", { p_key: key });
  if (error) return null;
  return data as Dashboard | null;
}

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const { cookies } = await import("next/headers");
  const cookieKey = (await cookies()).get("ops_key")?.value;
  const provided = key ?? cookieKey;
  const authorized = !!provided && !!process.env.LEADS_ADMIN_KEY && provided === process.env.LEADS_ADMIN_KEY;
  const d = authorized ? await fetchDashboard(provided!) : null;

  if (!authorized || d === null)
    return (
      <div>
        <PageHeader title="Operator Dashboard" desc="Live from Supabase" />
        <Notice tone="amber">Access key required — open as <code>/admin?key=YOUR_KEY</code> (then the cookie keeps you in).</Notice>
      </div>
    );

  const actions = [
    { label: "New leads to follow up", n: d.leads_new, href: "/admin/leads", tone: "bg-terracotta-tint text-terracotta-deep" },
    { label: "Contractor bids to relay", n: d.bids_new, href: "/admin/leads", tone: "bg-sky-50 text-sky-700" },
    { label: "Claims awaiting verification", n: d.claims_pending, href: "/admin/companies", tone: "bg-amber-50 text-amber-700" },
    { label: "Showcases to moderate", n: d.showcases_pending, href: "/admin/projects", tone: "bg-violet-50 text-violet-700" },
    { label: "Open disputes (48h clock)", n: d.disputes_open, href: "/admin/disputes", tone: "bg-red-50 text-red-600" },
  ].filter((a) => a.n > 0);

  return (
    <div>
      <PageHeader title="Operator Dashboard" desc="Live from Supabase · Dubai time" />

      {actions.length > 0 ? (
        <Card className="mb-6">
          <h2 className="mb-3 font-bold">Needs your action</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {actions.map((a) => (
              <Link key={a.label} href={a.href} className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium ${a.tone} transition hover:brightness-95`}>
                <span>{a.label}</span><b className="font-mono text-lg">{a.n}</b>
              </Link>
            ))}
          </div>
        </Card>
      ) : (
        <Notice tone="blue">Inbox zero — no leads, bids, claims, showcases or disputes waiting.</Notice>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="Leads (total)" value={fmt(d.leads_total)} sub={`${d.leads_today} today · ${d.consultations} consult / ${d.quotes} quote`} tone={d.leads_today > 0 ? "good" : "default"} />
        <Stat label="Open board briefs" value={fmt(d.on_board)} sub={`${d.bids_total} bids received`} />
        <Stat label="Companies" value={fmt(d.companies_total)} sub={`${d.companies_verified} verified · ${d.companies_contact} contact ✓`} />
        <Stat label="Showcases live" value={fmt(d.showcases_live)} sub={`${d.showcases_pending} pending`} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <Stat label="Registered users" value={fmt(d.users_total)} sub="Google sign-ups" />
        <Stat label="Newsletter subscribers" value={fmt(d.subscribers_total)} sub={Object.entries(d.subscribers_by_source).slice(0, 3).map(([s, n]) => `${s} ${n}`).join(" · ") || "—"} />
        <Stat label="AI consult calls today" value={`${d.consult_calls_today} / 400`} sub="daily spend ceiling" tone={d.consult_calls_today > 300 ? "bad" : "default"} />
        <Stat label="Disputes open" value={`${d.disputes_open}`} tone={d.disputes_open > 0 ? "bad" : "good"} sub="mediate within 48h" />
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 font-bold">Quick links</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/leads" className="rounded-lg border border-gray-200 px-4 py-2 hover:border-gray-400">Leads & bids</Link>
          <Link href="/admin/companies" className="rounded-lg border border-gray-200 px-4 py-2 hover:border-gray-400">Companies & verification</Link>
          <Link href="/admin/projects" className="rounded-lg border border-gray-200 px-4 py-2 hover:border-gray-400">Showcases</Link>
          <Link href="/admin/disputes" className="rounded-lg border border-gray-200 px-4 py-2 hover:border-gray-400">Disputes</Link>
          <Link href="/admin/subscribers" className="rounded-lg border border-gray-200 px-4 py-2 hover:border-gray-400">Subscribers</Link>
          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 px-4 py-2 hover:border-gray-400">GA4 ↗</a>
          <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 px-4 py-2 hover:border-gray-400">Search Console ↗</a>
        </div>
      </Card>
    </div>
  );
}
