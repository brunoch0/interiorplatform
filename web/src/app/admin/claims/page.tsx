import { createClient } from "@supabase/supabase-js";
import { Notice, PageHeader } from "@/components/ui";
import ClaimsReview, { type AdminClaim } from "./claims-review";

export const dynamic = "force-dynamic";

export default async function AdminClaims({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const { cookies } = await import("next/headers");
  const cookieKey = (await cookies()).get("ops_key")?.value;
  const adminKey = process.env.LEADS_ADMIN_KEY;
  const provided = key ?? cookieKey;
  const authorized = !!provided && !!adminKey && provided === adminKey;

  if (!authorized)
    return (
      <div>
        <PageHeader title="Claims" />
        <Notice tone="amber">Access key required.</Notice>
      </div>
    );

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await supabase.rpc("admin_list_claims", { p_key: provided });
  return <ClaimsReview claims={(data ?? []) as AdminClaim[]} adminKey={provided!} />;
}
