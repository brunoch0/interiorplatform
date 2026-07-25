"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type DisputeResult = { ok: true } | { ok: false; error: string };

export async function submitDispute(payload: {
  companyId: string | null;
  companyName: string;
  issueType: string;
  description: string;
  contractSigned: string;
  amountBand: string;
  name: string;
  email: string;
  phone: string;
  honeypot: string;
}): Promise<DisputeResult> {
  if (payload.honeypot !== "") return { ok: true };
  if (!payload.name.trim()) return { ok: false, error: "Please enter your name." };
  if (!payload.email.trim() && !payload.phone.trim())
    return { ok: false, error: "Add an email or WhatsApp number so our team can follow up." };
  if (payload.description.trim().length < 30)
    return { ok: false, error: "Please describe the issue in a bit more detail (a few sentences helps us act faster)." };

  const { error } = await supabase.from("disputes").insert({
    company_id: payload.companyId && /^[0-9a-f-]{36}$/.test(payload.companyId) ? payload.companyId : null,
    company_name: payload.companyName.trim().slice(0, 120) || null,
    issue_type: payload.issueType.slice(0, 60),
    description: payload.description.slice(0, 4000),
    contract_signed: payload.contractSigned === "yes" ? true : payload.contractSigned === "no" ? false : null,
    amount_band: payload.amountBand.slice(0, 60) || null,
    name: payload.name.trim().slice(0, 80),
    email: payload.email.trim().toLowerCase() || null,
    phone: payload.phone.trim().slice(0, 40) || null,
  });

  if (error) {
    console.error("dispute insert failed", error);
    return { ok: false, error: "Something went wrong — please try again." };
  }
  return { ok: true };
}
