"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function updateDispute(adminKey: string, id: string, status: string, notes: string | null) {
  const { error } = await supabase.rpc("admin_update_dispute", {
    p_key: adminKey,
    p_id: id,
    p_status: status,
    p_notes: notes,
  });
  if (error) console.error("dispute update failed", error);
}
