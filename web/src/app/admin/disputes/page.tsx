import { createClient } from "@supabase/supabase-js";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";
import DisputeActions from "./dispute-actions";

export const dynamic = "force-dynamic";

export type AdminDispute = {
  id: string;
  company_id: string | null;
  company_name: string | null;
  company_phone: string | null;
  issue_type: string;
  description: string;
  contract_signed: boolean | null;
  amount_band: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

async function fetchDisputes(key: string): Promise<AdminDispute[] | null> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data, error } = await supabase.rpc("admin_list_disputes", { p_key: key });
  if (error) return null;
  return data as AdminDispute[] | null;
}

const STATUS_TONE: Record<string, "blue" | "amber" | "green" | "red" | "gray"> = {
  new: "blue",
  mediating: "amber",
  resolved: "green",
  escalated: "red",
  closed: "gray",
};

export default async function AdminDisputes({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const { cookies } = await import("next/headers");
  const cookieKey = (await cookies()).get("ops_key")?.value;
  const provided = key ?? cookieKey;
  const authorized = !!provided && !!process.env.LEADS_ADMIN_KEY && provided === process.env.LEADS_ADMIN_KEY;
  const disputes = authorized ? await fetchDisputes(provided!) : null;

  if (!authorized || disputes === null)
    return (
      <div>
        <PageHeader title="Dispute Mediation" desc="Consumer reports (live)" />
        <Notice tone="amber">Access key required — open as <code>/admin/disputes?key=YOUR_KEY</code>.</Notice>
      </div>
    );

  const open = disputes.filter((d) => d.status === "new" || d.status === "mediating");

  return (
    <div>
      <PageHeader title="Dispute Mediation" desc={`${open.length} open · mediate within 48h, then escalate per the protection ladder`} />
      <Notice tone="blue">
        Playbook: ① contact both sides within 1 business day ② push contractor for a 48h fix ③ unresolved → suspend
        verification + note on metrics ④ help consumer file with Dubai Consumer (600 545 555) — evidence pack: contract,
        payments, photos, timeline.
      </Notice>

      <div className="mt-6 space-y-4">
        {disputes.length === 0 && <Card className="text-center text-sm text-gray-500">No reports yet.</Card>}
        {disputes.map((d) => (
          <Card key={d.id}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold">{d.company_name ?? "Unknown contractor"}</p>
              <Badge tone="gray">{d.issue_type}</Badge>
              {d.amount_band && <Badge tone="amber">{d.amount_band}</Badge>}
              {d.contract_signed === false && <Badge tone="red">No written contract</Badge>}
              <Badge tone={STATUS_TONE[d.status] ?? "gray"}>{d.status}</Badge>
              <span className="ml-auto text-xs text-gray-400">{new Date(d.created_at).toLocaleString("en-GB", { timeZone: "Asia/Dubai" })}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Reporter: {d.name}
              {d.phone && <span className="font-mono"> · {d.phone}</span>}
              {d.email && <span className="font-mono"> · {d.email}</span>}
              {d.company_phone && <span className="font-mono"> · contractor: {d.company_phone}</span>}
            </p>
            <p className="mt-3 whitespace-pre-line rounded-xl bg-gray-50 p-3 text-sm text-gray-600">{d.description}</p>
            {d.admin_notes && <p className="mt-2 text-xs text-gray-500"><b>Notes:</b> {d.admin_notes}</p>}
            <DisputeActions adminKey={provided!} id={d.id} status={d.status} />
          </Card>
        ))}
      </div>
    </div>
  );
}
