// AI brief builder — extracts a structured renovation brief from a short conversation.
// Guardrails: extractor only (no prices, no contractor recommendations), hard turn cap.
import { NextRequest, NextResponse } from "next/server";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
const MAX_USER_TURNS = 6;

const SYSTEM = `You are the intake assistant for Dubai Interior (onepassinterior.com), a Dubai renovation platform. A homeowner describes what they want in their own words; your only job is to gather what contractors need for a first quote, then submit a structured brief.

Rules:
- Ask ONE short, friendly question at a time. Maximum 4 questions total — fewer if the user already covered things.
- Gather, in rough priority: what work is needed (rooms/scope), space type (apartment/villa/commercial), area/community in Dubai, timeline or move-in date, whether they'll live there during works, budget comfort (only ask once, accept "not sure"), style preference, household (pets/kids/elderly) if relevant.
- The user often doesn't know renovation terms — translate their words into scope yourself, don't quiz them on jargon.
- Reply in the user's language (English, Korean, Arabic, etc.).
- NEVER estimate prices or costs, never say what things should cost, and never recommend or name any specific contractor. If asked, say the platform team will cover that in the consultation.
- Stay strictly on home/commercial renovation intake. Politely refuse anything else.
- When you have enough (or the user seems done answering), call submit_brief. Enough = scope + space type + area or timeline. Don't over-ask.`;

const BRIEF_TOOL = {
  name: "submit_brief",
  description: "Submit the structured renovation brief once enough information is gathered.",
  input_schema: {
    type: "object",
    properties: {
      scope: { type: "string", description: "What work is needed, concise, e.g. 'Full renovation: kitchen, 2 bathrooms, flooring'" },
      space_type: { type: "string", enum: ["Apartment", "Villa", "Commercial", "Not sure yet"] },
      area: { type: "string", description: "Dubai area/community, empty string if unknown" },
      timeline: { type: "string", description: "Timeline or move-in constraint in the user's words, empty if unknown" },
      budget_hint: { type: "string", description: "Budget comfort if volunteered, e.g. 'around AED 150K' or 'not sure'" },
      occupied: { type: "string", description: "'yes' if living there during works, 'no', or 'unknown'" },
      style: { type: "string", description: "Style preference if any, else empty" },
      household: { type: "string", description: "Pets/kids/elderly/accessibility notes, else empty" },
      summary: { type: "string", description: "2-3 sentence plain-English brief a contractor can quote from" },
    },
    required: ["scope", "space_type", "summary"],
  },
} as const;

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ type: "unavailable" }, { status: 503 });

  let messages: Msg[];
  try {
    const body = await req.json();
    messages = (body.messages as Msg[]) ?? [];
  } catch {
    return NextResponse.json({ type: "error" }, { status: 400 });
  }

  // Basic abuse guards: shape, length, turn cap
  messages = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-16)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));
  const userTurns = messages.filter((m) => m.role === "user").length;
  if (userTurns === 0 || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json({ type: "error" }, { status: 400 });
  }

  const forceBrief = userTurns >= MAX_USER_TURNS;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM,
      messages,
      tools: [BRIEF_TOOL],
      tool_choice: forceBrief ? { type: "tool", name: "submit_brief" } : { type: "auto" },
    }),
  });

  if (!res.ok) {
    console.error("consult api error", res.status, await res.text());
    return NextResponse.json({ type: "unavailable" }, { status: 503 });
  }

  const data = await res.json();
  const toolUse = data.content?.find((b: { type: string }) => b.type === "tool_use");
  if (toolUse) return NextResponse.json({ type: "brief", brief: toolUse.input });

  const text = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
  return NextResponse.json({ type: "question", text });
}
