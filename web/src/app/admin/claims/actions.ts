"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function reviewClaim(key: string, id: string, action: "approve" | "reject", reason?: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("admin_review_claim", {
    p_key: key, p_id: id, p_action: action, p_reason: reason ?? null,
  });
  if (error) { console.error("review_claim failed", error); return false; }
  return data === true;
}

export async function signedDocUrl(key: string, path: string): Promise<string | null> {
  // key gate: only proceed for the ops key (docs live in a private bucket)
  if (key !== process.env.LEADS_ADMIN_KEY) return null;
  const { data, error } = await supabase.storage.from("licenses").createSignedUrl(path, 600);
  if (error) return null;
  return data.signedUrl;
}
