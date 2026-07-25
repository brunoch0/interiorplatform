"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type BidResult = { ok: true } | { ok: false; error: string };

export async function submitBid(payload: {
  requestId: string;
  companyId: string | null;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  priceBand: string;
  timeline: string;
  message: string;
  honeypot: string;
}): Promise<BidResult> {
  if (payload.honeypot !== "") return { ok: true };
  if (!/^[0-9a-f-]{36}$/.test(payload.requestId)) return { ok: false, error: "Invalid request." };
  if (!payload.companyName.trim()) return { ok: false, error: "Please enter your company name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) return { ok: false, error: "A valid email is required — the homeowner's reply comes through us to this address." };

  const { error } = await supabase.from("quote_bids").insert({
    request_id: payload.requestId,
    company_id: payload.companyId && /^[0-9a-f-]{36}$/.test(payload.companyId) ? payload.companyId : null,
    company_name: payload.companyName.trim().slice(0, 120),
    contact_name: payload.contactName.trim().slice(0, 80) || null,
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim().slice(0, 40) || null,
    price_band: payload.priceBand.slice(0, 60) || null,
    timeline: payload.timeline.slice(0, 120) || null,
    message: payload.message.slice(0, 2000) || null,
  });

  if (error) {
    console.error("bid insert failed", error);
    return { ok: false, error: "Something went wrong — please try again." };
  }
  return { ok: true };
}
