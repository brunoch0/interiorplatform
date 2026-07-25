"use server";

import { createClient } from "@supabase/supabase-js";
import { trySubscribe } from "@/lib/subscribe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type SubmitResult = { ok: true; ref: string } | { ok: false; error: string };

export async function submitQuoteRequest(formData: FormData): Promise<SubmitResult> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  let details = String(formData.get("details") ?? "").trim();
  // Fold style/household preferences into details — keeps quote_requests schema stable
  const style = String(formData.get("style") ?? "").trim();
  const household = formData.getAll("household").map(String).filter(Boolean);
  const prefs = [style && style !== "No preference" ? `Style: ${style}` : "", household.length ? `Household: ${household.join(", ")}` : ""]
    .filter(Boolean)
    .join(" · ");
  if (prefs) details = details ? `[${prefs}]\n${details}` : `[${prefs}]`;
  const companyIds = String(formData.get("companyIds") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[0-9a-f-]{36}$/.test(s))
    .slice(0, 5);

  // honeypot — bots fill every field
  if (String(formData.get("company_website") ?? "") !== "") return { ok: true, ref: "QR-OK" };

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!phone && !email) return { ok: false, error: "Please provide a phone number or email so contractors can reach you." };

  // Pre-generate id/ref so no SELECT-after-INSERT is needed (anon has insert-only access)
  const id = crypto.randomUUID();
  const ref = `QR-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${id.slice(0, 4).toUpperCase()}`;

  const { error } = await supabase.from("quote_requests").insert({
    id,
    ref,
    name,
    phone: phone || null,
    email: email || null,
    space_type: String(formData.get("spaceType") ?? "") || null,
    area: String(formData.get("area") ?? "") || null,
    budget: String(formData.get("budget") ?? "") || null,
    timeline: String(formData.get("timeline") ?? "") || null,
    details: details || null,
    is_public: formData.get("isPublic") != null,
  });

  if (error) {
    console.error("quote insert failed", error);
    return { ok: false, error: "Something went wrong — please try again." };
  }

  if (email && formData.get("newsletter") != null) await trySubscribe(email, "quote");

  if (companyIds.length > 0) {
    const { error: joinError } = await supabase
      .from("quote_request_companies")
      .insert(companyIds.map((company_id) => ({ request_id: id, company_id })));
    if (joinError) console.error("quote companies insert failed", joinError);
  }

  return { ok: true, ref };
}
