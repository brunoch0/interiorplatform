"use server";

import { createClient } from "@supabase/supabase-js";
import { trySubscribe } from "@/lib/subscribe";
import { parseAttribution } from "@/lib/attribution-server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type ClaimResult = { ok: true } | { ok: false; error: string };

export async function submitClaim(payload: {
  attribution?: string;
  companyId: string | null;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  tradeLicensePath: string;
  detLicensePath: string | null;
  licenseNumber: string;
  licenseExpiry: string | null;
  newsletter?: boolean;
}): Promise<ClaimResult> {
  if (!payload.contactName.trim()) return { ok: false, error: "Please enter the contact person's name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) return { ok: false, error: "A valid work email is required." };
  if (!payload.tradeLicensePath) return { ok: false, error: "Trade license upload is required." };

  const { error } = await supabase.from("claims").insert({
    attribution: parseAttribution(payload.attribution),
    company_id: payload.companyId,
    company_name_submitted: payload.companyName || null,
    contact_name: payload.contactName.trim().slice(0, 120),
    email: payload.email.toLowerCase(),
    phone: payload.phone || null,
    trade_license_path: payload.tradeLicensePath,
    det_license_path: payload.detLicensePath,
    license_number: payload.licenseNumber || null,
    license_expiry: payload.licenseExpiry || null,
    status: "pending",
  });

  if (error) {
    console.error("claim insert failed", error);
    return { ok: false, error: "Something went wrong — please try again." };
  }
  if (payload.newsletter) await trySubscribe(payload.email, "claim");
  return { ok: true };
}
