"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function adminUpdateCompany(key: string, id: string, field: string, value: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("admin_update_company", {
    p_key: key,
    p_id: id,
    p_field: field,
    p_value: value,
  });
  if (error) {
    console.error("admin_update_company failed", error);
    return false;
  }
  return data === true;
}
