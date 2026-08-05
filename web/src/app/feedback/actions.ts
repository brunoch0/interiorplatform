"use server";

import { createClient } from "@supabase/supabase-js";
import { FEEDBACK_KINDS, type FeedbackKind } from "./kinds";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type FeedbackResult = { ok: true } | { ok: false; error: string };

export async function submitFeedback(payload: {
  kind: string;
  message: string;
  page: string;
  email: string;
  honeypot: string;
}): Promise<FeedbackResult> {
  if (payload.honeypot !== "") return { ok: true };
  if (payload.message.trim().length < 10)
    return { ok: false, error: "A sentence or two helps — what did you see?" };

  const { error } = await supabase.from("feedback").insert({
    kind: FEEDBACK_KINDS.includes(payload.kind as FeedbackKind)
      ? payload.kind
      : "Something else",
    message: payload.message.trim().slice(0, 4000),
    page: payload.page.trim().slice(0, 300) || null,
    email: payload.email.trim().toLowerCase().slice(0, 160) || null,
  });

  if (error) {
    console.error("feedback insert failed", error);
    return { ok: false, error: "Something went wrong — please try again." };
  }
  return { ok: true };
}
