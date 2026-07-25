"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function reviewProject(key: string, id: string, action: "publish" | "reject"): Promise<boolean> {
  const { data, error } = await supabase.rpc("admin_review_project", { p_key: key, p_id: id, p_action: action });
  if (error) {
    console.error("review_project failed", error);
    return false;
  }
  return data === true;
}
