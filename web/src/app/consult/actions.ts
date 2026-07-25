"use server";

import { createClient } from "@supabase/supabase-js";
import { trySubscribe } from "@/lib/subscribe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type Brief = {
  scope: string;
  space_type: string;
  area?: string;
  timeline?: string;
  budget_hint?: string;
  occupied?: string;
  style?: string;
  household?: string;
  summary: string;
};

export type ConsultResult = { ok: true; ref: string } | { ok: false; error: string };

export async function submitConsultation(payload: {
  name: string;
  phone: string;
  email: string;
  honeypot: string;
  isPublic: boolean;
  newsletter: boolean;
  brief: Brief | null;
  transcript: { role: string; content: string }[];
}): Promise<ConsultResult> {
  if (payload.honeypot !== "") return { ok: true, ref: "CR-OK" };

  const name = payload.name.trim();
  const phone = payload.phone.trim();
  const email = payload.email.trim();
  if (!name) return { ok: false, error: "Please enter your name." };
  if (!phone && !email) return { ok: false, error: "Please add a WhatsApp number or email so we can reach you." };

  const id = crypto.randomUUID();
  const ref = `CR-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${id.slice(0, 4).toUpperCase()}`;
  const b = payload.brief;

  const detailsParts = b
    ? [b.summary, b.budget_hint && `Budget: ${b.budget_hint}`, b.occupied && b.occupied !== "unknown" && `Living there during works: ${b.occupied}`, b.style && `Style: ${b.style}`, b.household && `Household: ${b.household}`]
    : [];

  const { error } = await supabase.from("quote_requests").insert({
    id,
    ref,
    type: "consultation",
    name,
    phone: phone || null,
    email: email || null,
    space_type: b?.space_type || null,
    area: b?.area || null,
    timeline: b?.timeline || null,
    details: detailsParts.filter(Boolean).join("\n") || null,
    is_public: payload.isPublic,
    brief: b ?? null,
    transcript: payload.transcript.slice(0, 24).map((m) => ({ role: m.role, content: String(m.content).slice(0, 1500) })),
  });

  if (error) {
    console.error("consultation insert failed", error);
    return { ok: false, error: "Something went wrong — please try again." };
  }
  if (email && payload.newsletter) await trySubscribe(email, "consult");
  return { ok: true, ref };
}
