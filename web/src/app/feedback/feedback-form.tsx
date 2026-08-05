"use client";

import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Card, Notice } from "@/components/ui";
import { submitFeedback } from "./actions";
import { FEEDBACK_KINDS } from "./kinds";

export default function FeedbackForm({ from }: { from?: string }) {
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await submitFeedback({
        kind: String(formData.get("kind") ?? ""),
        message: String(formData.get("message") ?? ""),
        // Where they came from matters more than where the form lives.
        page: String(formData.get("page") ?? "") || from || pathname,
        email: String(formData.get("email") ?? ""),
        honeypot: String(formData.get("company_website") ?? ""),
      });
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  };

  if (done)
    return (
      <Card className="text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <MessageSquare className="h-6 w-6 text-emerald-600" strokeWidth={1.75} />
        </span>
        <p className="mt-4 font-serif text-xl">Got it — thank you.</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Every message is read by a person. If you left an email and it needs a reply, you&apos;ll hear back.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-walnut px-6 py-3 text-sm font-bold text-cream hover:bg-walnut-deep">
          Back to the site
        </Link>
      </Card>
    );

  return (
    <Card>
      <form action={submit} className="space-y-5">
        <div>
          <label htmlFor="kind" className="text-sm font-medium">What kind of thing is it?</label>
          <select id="kind" name="kind" defaultValue={FEEDBACK_KINDS[0]}
            className="mt-1.5 w-full rounded-xl border border-gray-200 bg-cream px-4 py-2.5 text-sm">
            {FEEDBACK_KINDS.map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-medium">What happened?</label>
          <textarea id="message" name="message" rows={6} required
            placeholder="A broken page, a company listed with the wrong details, something confusing, or something you wish existed. Detail helps."
            className="mt-1.5 w-full rounded-xl border border-gray-200 bg-cream px-4 py-2.5 text-sm leading-relaxed" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="page" className="text-sm font-medium">
              Page <span className="font-normal text-gray-400">optional</span>
            </label>
            <input id="page" name="page" defaultValue={from ?? ""} placeholder="/companies/…"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-cream px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="font-normal text-gray-400">only if you want a reply</span>
            </label>
            <input id="email" name="email" type="email" placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-cream px-4 py-2.5 text-sm" />
          </div>
        </div>

        {/* honeypot */}
        <input name="company_website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

        {error && <Notice tone="red">{error}</Notice>}

        <button type="submit" disabled={pending}
          className="w-full rounded-xl bg-terracotta px-6 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep disabled:opacity-60">
          {pending ? "Sending…" : "Send"}
        </button>

        <p className="text-xs leading-relaxed text-gray-400">
          Reporting a problem with a contractor you hired is different — that goes to our resolution team via{" "}
          <Link href="/report" className="underline decoration-terracotta decoration-2 underline-offset-2">Report an issue</Link>.
        </p>
      </form>
    </Card>
  );
}
