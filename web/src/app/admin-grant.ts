"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Signed-in super admins (ADMIN_EMAILS env) get the ops_key cookie automatically,
// so every existing key-gated admin page and the proxy work unchanged.
export async function grantAdminCookie(accessToken: string): Promise<boolean> {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const opsKey = process.env.LEADS_ADMIN_KEY;
  if (adminEmails.length === 0 || !opsKey || !accessToken) return false;

  const { data } = await supabase.auth.getUser(accessToken);
  const email = data.user?.email?.toLowerCase();
  if (!email || !adminEmails.includes(email)) return false;

  (await cookies()).set("ops_key", opsKey, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}
