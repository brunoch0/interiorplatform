// Server-side newsletter opt-in — fire-and-forget, never blocks the main submission
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function trySubscribe(email: string, source: string) {
  const e = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return;
  const { error } = await supabase.from("email_subscribers").insert({ email: e, source });
  if (error && !error.message.includes("duplicate")) console.error("subscribe failed", error);
}
