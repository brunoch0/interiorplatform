"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellOff, Calculator, ClipboardList, LogOut, MessageCircle, Sparkles } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Badge, Card, PageHeader } from "@/components/ui";

type MyRequest = {
  id: string;
  ref: string;
  type: string;
  status: string;
  created_at: string;
  space_type: string | null;
  area: string | null;
  budget: string | null;
  timeline: string | null;
  details: string | null;
  is_public: boolean;
  brief: { summary?: string } | null;
  transcript: { role: string; content: string; images?: string[] }[] | null;
};

const STATUS_TONE: Record<string, "blue" | "amber" | "green" | "gray"> = {
  new: "blue",
  contacted: "amber",
  matched: "green",
};

export default function AccountClient() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [requests, setRequests] = useState<MyRequest[]>([]);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      setReady(true);
      if (!u) return;
      const [{ data: reqs }, { data: subs }] = await Promise.all([
        supabaseBrowser
          .from("quote_requests")
          .select("id,ref,type,status,created_at,space_type,area,budget,timeline,details,is_public,brief,transcript")
          .order("created_at", { ascending: false }),
        supabaseBrowser.from("email_subscribers").select("email").limit(1),
      ]);
      setRequests((reqs as MyRequest[]) ?? []);
      setSubscribed((subs?.length ?? 0) > 0);
    });
  }, []);

  const signIn = () =>
    supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/account` },
    });

  const signOut = async () => {
    await supabaseBrowser.auth.signOut();
    window.location.href = "/";
  };

  const unsubscribe = async () => {
    if (!user?.email) return;
    await supabaseBrowser.from("email_subscribers").delete().eq("email", user.email.toLowerCase());
    setSubscribed(false);
  };

  if (!ready) return <div className="py-24 text-center text-sm text-gray-400">Loading…</div>;

  if (!user)
    return (
      <Card className="mx-auto max-w-md py-12 text-center">
        <p className="font-serif text-xl font-semibold text-walnut">Sign in to see your page</p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
          Your consultations, quote requests and contractor replies — all in one place.
        </p>
        <button onClick={signIn}
          className="mt-5 rounded-xl bg-walnut px-8 py-3 text-sm font-bold text-cream transition hover:bg-walnut-deep">
          Continue with Google
        </button>
      </Card>
    );

  const name = user.user_metadata?.full_name ?? user.email;

  return (
    <div>
      {/* Profile header */}
      <Card className="mb-6 flex flex-wrap items-center gap-4">
        {user.user_metadata?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.user_metadata.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-tint text-xl font-bold text-terracotta-deep">
            {(name?.[0] ?? "U").toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold">{name}</p>
          <p className="truncate text-xs text-gray-400">{user.email}</p>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 hover:border-gray-400">
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </Card>

      {/* My requests */}
      <div className="mb-3 flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-terracotta-deep" strokeWidth={1.75} />
        <h2 className="font-bold">My requests</h2>
        <span className="text-xs text-gray-400">{requests.length}</span>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center">
          <p className="font-semibold">Nothing here yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            Start a free consultation or request quotes — everything you submit while signed in shows up here, along
            with our team&apos;s follow-up.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/consult" className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep">
              <Sparkles className="h-4 w-4" /> Free consultation
            </Link>
            <Link href="/calculator" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-charcoal hover:border-clay">
              <Calculator className="h-4 w-4 text-terracotta-deep" /> Cost calculator
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold">{r.ref}</span>
                {r.type === "consultation" ? <Badge tone="amber">Consultation</Badge> : <Badge tone="blue">Quote request</Badge>}
                <Badge tone={STATUS_TONE[r.status] ?? "gray"}>{r.status === "new" ? "In review" : r.status}</Badge>
                {r.is_public && <Badge tone="green">On open board</Badge>}
                <span className="ml-auto text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("en-GB", { timeZone: "Asia/Dubai", day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {[r.space_type, r.area, r.budget, r.timeline].filter(Boolean).join(" · ") || "—"}
              </p>
              {(r.brief?.summary || r.details) && (
                <p className="mt-3 whitespace-pre-line rounded-xl bg-sand p-3 text-sm leading-relaxed text-gray-600">
                  {r.brief?.summary ?? r.details}
                </p>
              )}
              {r.transcript && r.transcript.length > 0 && (
                <details className="mt-3 rounded-xl border border-gray-100 p-3">
                  <summary className="cursor-pointer text-xs font-semibold text-gray-500">
                    <MessageCircle className="mr-1 inline h-3.5 w-3.5" /> Conversation ({r.transcript.length} messages)
                  </summary>
                  <div className="mt-3 space-y-2">
                    {r.transcript.map((m, i) => (
                      <div key={i} className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${m.role === "user" ? "bg-terracotta-tint text-terracotta-deep" : "bg-gray-50 text-gray-600"}`}>
                        {m.content}
                        {m.images && m.images.length > 0 && (
                          <span className="mt-2 flex flex-wrap gap-1.5">
                            {m.images.map((u) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={u} src={u} alt="" className="h-16 w-16 rounded-lg object-cover" />
                            ))}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              )}
              <p className="mt-3 text-xs text-gray-400">
                Our team follows up on WhatsApp within one business day of submission. Questions? Reply to that thread
                or start a <Link href="/consult" className="font-semibold text-terracotta-deep underline">new consultation</Link>.
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Newsletter */}
      {subscribed !== null && (
        <Card className="mt-6 flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Renovation tips newsletter</p>
            <p className="text-xs text-gray-400">
              {subscribed ? "Subscribed — occasional guides and platform updates, no spam." : "Not subscribed."}
            </p>
          </div>
          {subscribed && (
            <button onClick={unsubscribe} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 hover:border-gray-400">
              <BellOff className="h-3.5 w-3.5" /> Unsubscribe
            </button>
          )}
        </Card>
      )}
    </div>
  );
}
