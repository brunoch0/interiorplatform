import { createClient } from "@supabase/supabase-js";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

type Subscriber = { email: string; source: string; created_at: string };

async function fetchSubscribers(key: string): Promise<Subscriber[] | null> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data, error } = await supabase.rpc("admin_list_subscribers", { p_key: key });
  if (error) return null;
  return data as Subscriber[] | null;
}

const SOURCE_TONE: Record<string, "blue" | "amber" | "green" | "gray"> = {
  signup: "green",
  consult: "amber",
  quote: "blue",
  calculator: "blue",
};

export default async function AdminSubscribers({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const { cookies } = await import("next/headers");
  const cookieKey = (await cookies()).get("ops_key")?.value;
  const provided = key ?? cookieKey;
  const authorized = !!provided && !!process.env.LEADS_ADMIN_KEY && provided === process.env.LEADS_ADMIN_KEY;
  const subs = authorized ? await fetchSubscribers(provided!) : null;

  if (!authorized || subs === null)
    return (
      <div>
        <PageHeader title="Subscribers" desc="Newsletter list (live)" />
        <Notice tone="amber">Access key required — open as <code>/admin/subscribers?key=YOUR_KEY</code>.</Notice>
      </div>
    );

  const bySource = subs.reduce<Record<string, number>>((acc, s) => {
    acc[s.source] = (acc[s.source] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Subscribers" desc={`${subs.length} emails · sources: ${Object.entries(bySource).map(([s, n]) => `${s} ${n}`).join(" · ") || "none yet"}`} />
      {subs.length === 0 && <Card className="text-center text-sm text-gray-500">No subscribers yet — every form has a default-checked opt-in, so this fills as leads arrive.</Card>}
      {subs.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Source</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subs.map((s) => (
                <tr key={s.email}>
                  <td className="px-5 py-2.5 font-mono text-xs">{s.email}</td>
                  <td className="px-5 py-2.5"><Badge tone={SOURCE_TONE[s.source] ?? "gray"}>{s.source}</Badge></td>
                  <td className="px-5 py-2.5 text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString("en-GB", { timeZone: "Asia/Dubai", day: "numeric", month: "short" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <p className="mt-4 text-xs text-gray-400">
        Export: copy from this table for now — Resend/broadcast wiring comes when we start sending.
      </p>
    </div>
  );
}
