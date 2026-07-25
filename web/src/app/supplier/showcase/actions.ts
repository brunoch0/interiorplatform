"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type ShowcaseResult = { ok: true } | { ok: false; error: string };

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; path: string; caption?: string };

export async function submitShowcase(payload: {
  companyId: string | null;
  companyName: string;
  email: string;
  phone: string;
  title: string;
  area: string;
  spaceType: string;
  budgetBand: string;
  durationWeeks: number | null;
  description: string;
  photos: string[];
  content?: ContentBlock[];
}): Promise<ShowcaseResult> {
  if (!payload.title || payload.title.trim().length < 5) return { ok: false, error: "Please add a project title (min 5 characters)." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) return { ok: false, error: "A valid email is required — we send the live link there." };
  if (payload.photos.length === 0) return { ok: false, error: "Add at least one photo." };

  const { error } = await supabase.from("projects").insert({
    company_id: payload.companyId,
    company_name_submitted: payload.companyName || null,
    contact_email: payload.email.toLowerCase(),
    contact_phone: payload.phone || null,
    title: payload.title.trim().slice(0, 120),
    area: payload.area || null,
    space_type: payload.spaceType || null,
    budget_band: payload.budgetBand || null,
    duration_weeks: payload.durationWeeks,
    description: payload.description.slice(0, 4000) || null,
    photos: payload.photos.slice(0, 10),
    content: (payload.content ?? [])
      .slice(0, 40)
      .map((b) =>
        b.type === "text"
          ? { type: "text", text: String(b.text).slice(0, 4000) }
          : { type: "image", path: String(b.path).slice(0, 200), caption: b.caption ? String(b.caption).slice(0, 200) : undefined },
      ),
    status: "pending",
  });

  if (error) {
    console.error("showcase insert failed", error);
    return { ok: false, error: "Something went wrong — please try again." };
  }
  return { ok: true };
}
