import { createClient } from "@supabase/supabase-js";
import { Notice, PageHeader } from "@/components/ui";
import CompaniesAdmin, { type AdminCompany } from "./companies-admin";

export const dynamic = "force-dynamic";

export default async function AdminCompanies({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const adminKey = process.env.LEADS_ADMIN_KEY;
  const authorized = !!key && !!adminKey && key === adminKey;

  if (!authorized)
    return (
      <div>
        <PageHeader title="Companies" desc="Verification ladder — operator checks" />
        <Notice tone="amber">
          Access key required. Open as <code>/admin/companies?key=YOUR_KEY</code> (same key as Leads — see
          <code> LEADS_ADMIN_KEY</code> in Vercel env). Bookmark the full URL.
        </Notice>
      </div>
    );

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data, error } = await supabase.rpc("admin_list_companies", { p_key: key });
  if (error || !data)
    return (
      <div>
        <PageHeader title="Companies" />
        <Notice tone="red">Failed to load companies. Check the key and try again.</Notice>
      </div>
    );

  return <CompaniesAdmin companies={data as AdminCompany[]} adminKey={key!} />;
}
