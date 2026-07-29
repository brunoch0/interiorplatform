"use client";

import { useState, useTransition } from "react";
import { track } from "@/components/analytics";
import { subscribeEmail } from "@/app/guides/subscribe-action";

export default function EmailCapture({ source }: { source: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (done)
    return (
      <div className="rounded-2xl border border-emerald-50 bg-emerald-50 p-6 text-center">
        <p className="font-semibold text-emerald-700">You&apos;re on the list ✓</p>
        <p className="mt-1 text-sm text-emerald-600">New guides and the 2026 cost checklist will land in your inbox.</p>
      </div>
    );

  return (
    <form
      action={(fd) => {
        setError(null);
        startTransition(async () => {
          const res = await subscribeEmail(fd);
          if (res.ok) {
            track("newsletter_signup", { source });
            setDone(true);
          } else setError(res.error);
        });
      }}
      className="rounded-2xl border border-gray-200 bg-cream p-6"
    >
      <p className="font-serif text-lg text-charcoal">Renovating soon? Get the numbers first.</p>
      <p className="mt-1 text-sm text-gray-500">
        The 2026 cost checklist and new Dubai renovation guides, by email. No spam — a few sends a month.
      </p>
      <input type="hidden" name="source" value={source} />
      <input name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-walnut px-6 py-3 text-sm font-bold text-cream transition hover:bg-walnut-deep disabled:opacity-50"
        >
          {pending ? "Adding…" : "Get the checklist"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </form>
  );
}
