"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Send, Sparkles } from "lucide-react";
import { Card, Notice } from "@/components/ui";
import { submitConsultation, type Brief } from "./actions";

type Msg = { role: "user" | "assistant"; content: string };

const OPENER =
  "Hi! Tell me about your place and what you'd like to change — in your own words, any language. No renovation jargon needed.";

const CHIPS = [
  "Just moved to a new apartment, not sure where to start",
  "Kitchen and bathrooms feel outdated",
  "Full villa renovation",
  "인테리어 처음인데 뭐부터 해야 할지 모르겠어요",
];

export default function ConsultChat() {
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: OPENER }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, thinking, brief]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || thinking || brief) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setThinking(true);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // Opener is UI-only; the API expects the conversation to start with the user
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      if (!res.ok) throw new Error("unavailable");
      const data = await res.json();
      if (data.type === "brief") {
        setBrief(data.brief);
        setMessages((m) => [...m, { role: "assistant", content: "Perfect — I've put your brief together. Check it below and add your contact so our team can follow up." }]);
      } else if (data.type === "question") {
        setMessages((m) => [...m, { role: "assistant", content: data.text }]);
      } else {
        throw new Error("unavailable");
      }
    } catch {
      setUnavailable(true);
    } finally {
      setThinking(false);
    }
  };

  const submit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await submitConsultation({
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        honeypot: String(formData.get("company_website") ?? ""),
        isPublic: formData.get("isPublic") != null,
        brief,
        transcript: messages,
      });
      if (res.ok) setRef(res.ref);
      else setError(res.error);
    });
  };

  if (ref)
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" strokeWidth={1.75} />
        </span>
        <h2 className="mt-4 text-2xl font-bold">Consultation requested</h2>
        <p className="mt-2 text-sm text-gray-500">
          Reference <b className="font-mono text-charcoal">{ref}</b>. Our team will message you on WhatsApp within one
          business day with practical next steps — free, no obligation.
        </p>
      </div>
    );

  if (unavailable)
    return (
      <Card>
        <Notice tone="amber">
          The assistant is taking a break. You can still{" "}
          <Link href="/quote" className="font-semibold underline">request quotes with the standard form</Link> — it takes 2 minutes.
        </Notice>
      </Card>
    );

  return (
    <div>
      <Card className="overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-sand px-5 py-3">
          <Sparkles className="h-4 w-4 text-terracotta-deep" strokeWidth={1.75} />
          <p className="text-sm font-semibold">Renovation assistant</p>
          <p className="ml-auto text-[11px] text-gray-400">Free · no account · takes ~2 minutes</p>
        </div>

        <div className="max-h-[26rem] space-y-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-walnut text-cream" : "bg-gray-50 text-gray-700"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-gray-50 px-4 py-2.5 text-sm text-gray-400">…</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-1.5 px-5 pb-3">
            {CHIPS.map((c) => (
              <button key={c} onClick={() => send(c)}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:border-terracotta hover:text-terracotta-deep">
                {c}
              </button>
            ))}
          </div>
        )}

        {!brief && (
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-gray-100 px-4 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here — any language works…"
              maxLength={1500}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
            />
            <button type="submit" disabled={thinking || !input.trim()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta text-cream transition hover:bg-terracotta-deep disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </Card>

      {brief && (
        <Card className="mt-5">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-terracotta-deep" strokeWidth={1.75} />
            <h2 className="font-bold">Your brief</h2>
            <span className="ml-auto text-[11px] text-gray-400">Our team reviews this before contacting you</span>
          </div>
          <p className="mt-3 rounded-xl bg-sand p-4 text-sm leading-relaxed text-gray-700">{brief.summary}</p>
          <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
            {[
              ["Scope", brief.scope],
              ["Space", brief.space_type],
              ["Area", brief.area],
              ["Timeline", brief.timeline],
              ["Budget", brief.budget_hint],
              ["Style", brief.style],
              ["Household", brief.household],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="flex gap-2 rounded-lg bg-gray-50 px-3 py-2">
                <dt className="shrink-0 text-gray-400">{k}</dt>
                <dd className="text-gray-700">{v}</dd>
              </div>
            ))}
          </dl>

          <form action={submit} className="mt-5 border-t border-gray-100 pt-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <input name="name" required placeholder="Your name *" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              <input name="phone" placeholder="WhatsApp number" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              <input name="email" type="email" placeholder="Email" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </div>
            <input name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-gray-500">
              <input type="checkbox" name="isPublic" defaultChecked className="mt-0.5 h-3.5 w-3.5 accent-[#C06A45]" />
              Also post this brief anonymously on the Open Projects board so more contractors can quote. Your name and
              contact details are never shown.
            </label>
            {error && <div className="mt-3"><Notice tone="red">{error}</Notice></div>}
            <button type="submit" disabled={pending}
              className="mt-4 w-full rounded-xl bg-terracotta py-3.5 text-sm font-bold text-cream transition hover:bg-terracotta-deep disabled:opacity-50">
              {pending ? "Sending…" : "Request free consultation"}
            </button>
            <p className="mt-2 text-center text-[11px] text-gray-400">
              WhatsApp or email — one is enough. Shared only with our concierge team, never published.
            </p>
          </form>
        </Card>
      )}
    </div>
  );
}
