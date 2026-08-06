// Resend delivery events -> email_events. The send-only API key cannot read
// delivery stats back, so this is the only way we learn whether outreach landed.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifySvix, freshTimestamp } from "@/lib/svix";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

/**
 * Resend only ever POSTs here. GET exists so that opening the URL in a browser
 * — which happens, the address appears in test emails — reports status instead
 * of Chrome's "this page isn't working" 405 screen.
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "resend-webhook",
    method: "POST only",
    configured: Boolean(process.env.RESEND_WEBHOOK_SECRET),
  });
}

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "RESEND_WEBHOOK_SECRET not configured" }, { status: 503 });
  }

  const id = req.headers.get("svix-id");
  const ts = req.headers.get("svix-timestamp");
  const sig = req.headers.get("svix-signature");
  const body = await req.text();

  if (!id || !ts || !sig || !verifySvix(secret, id, ts, body, sig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  if (!freshTimestamp(ts)) {
    return NextResponse.json({ error: "stale timestamp" }, { status: 401 });
  }

  let evt: { type?: string; created_at?: string; data?: Record<string, unknown> };
  try {
    evt = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const d = evt.data ?? {};
  const to = Array.isArray(d.to) ? d.to[0] : d.to;

  const { error } = await supabase.from("email_events").insert({
    event_type: String(evt.type ?? "unknown").slice(0, 60),
    email: typeof to === "string" ? to.toLowerCase().slice(0, 160) : null,
    subject: typeof d.subject === "string" ? d.subject.slice(0, 300) : null,
    resend_email_id: typeof d.email_id === "string" ? d.email_id : null,
    occurred_at: evt.created_at ?? null,
    payload: d,
  });

  // A duplicate is Resend retrying a delivery we already stored — not a failure.
  if (error && !error.message.includes("duplicate key")) {
    console.error("email_events insert failed", error);
    return NextResponse.json({ error: "store failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
