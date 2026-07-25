import { createClient } from "@supabase/supabase-js";
import { Notice, PageHeader } from "@/components/ui";
import ProjectsModeration, { type AdminProject } from "./projects-moderation";

export const dynamic = "force-dynamic";

export default async function AdminProjects({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const { cookies } = await import("next/headers");
  const cookieKey = (await cookies()).get("ops_key")?.value;
  const adminKey = process.env.LEADS_ADMIN_KEY;
  const provided = key ?? cookieKey;
  const authorized = !!provided && !!adminKey && provided === adminKey;

  if (!authorized)
    return (
      <div>
        <PageHeader title="Showcases" />
        <Notice tone="amber">Access key required.</Notice>
      </div>
    );

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await supabase.rpc("admin_list_projects", { p_key: provided });
  return <ProjectsModeration projects={(data ?? []) as AdminProject[]} adminKey={provided!} />;
}
