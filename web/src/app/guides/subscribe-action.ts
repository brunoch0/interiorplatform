"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function subscribeEmail(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  if (String(formData.get("company_website") ?? "") !== "") return { ok: true };
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "guides").slice(0, 80);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Please enter a valid email." };

  const { error } = await supabase.from("email_subscribers").insert({ email, source });
  if (error && !error.message.includes("duplicate")) {
    console.error("subscribe failed", error);
    return { ok: false, error: "Something went wrong — please try again." };
  }
  return { ok: true };
}
