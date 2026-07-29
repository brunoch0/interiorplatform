"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, ClipboardList, ExternalLink, Gavel, Images, MessageCircle, Star } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Badge, Card, Notice } from "@/components/ui";

type Lead = {
  ref: string; created_at: string; status: string;
  space_type: string | null; area: string | null; budget: string | null; timeline: string | null;
  details: string | null; name: string; phone: string | null; email: string | null;
};
type Bid = { created_at: string; price_band: string | null; status: string; request_ref: string | null; request_area: string | null; request_scope: string };
type Project = { title: string; slug: string | null; status: string; created_at: string };
type Dashboard =
  | { status: "unauthenticated" | "none" | "pending" | "rejected" }
  | {
      status: "approved";
      company: { id: string; name: string; area: string | null; verified: boolean; rating: number | null; rating_count: number | null; contact_verified: boolean; portfolio_verified: boolean };
      leads: Lead[]; bids: Bid[]; projects: Project[];
    };

export default function SupplierDashboardClient() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(async ({ data: s }) => {
      if (!s.session) { setSignedIn(false); return; }
      setSignedIn(true);
      const { data: d } = await supabaseBrowser.rpc("supplier_dashboard");
      setData((d as Dashboard) ?? { status: "none" });
    });
  }, []);

  const signIn = () =>
    supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/supplier/dashboard` },
    });

  if (signedIn === null) return <div className="py-24 text-center text-sm text-gray-400">Loading…</div>;

  if (signedIn === false)
    return (
      <Card className="mx-auto max-w-md py-12 text-center">
        <p className="font-serif text-xl font-semibold text-walnut">Contractor sign in</p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
          Sign in with the same Google account email you used to claim your company profile.
        </p>
        <button onClick={signIn}
          className="mt-5 rounded-xl bg-walnut px-8 py-3 text-sm font-bold text-cream transition hover:bg-walnut-deep">
          Continue with Google
        </button>
      </Card>
    );

  if (!data) return <div className="py-24 text-center text-sm text-gray-400">Loading…</div>;

  if (data.status !== "approved") {
    return (
      <Card className="mx-auto max-w-lg py-10 text-center">
        {data.status === "pending" ? (
          <>
            <p className="font-serif text-xl font-semibold text-walnut">Claim under review</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              We verify licences within 1–2 business days. You&apos;ll get the result by email — this dashboard unlocks
              automatically once approved.
            </p>
          </>
        ) : data.status === "rejected" ? (
          <>
            <p className="font-serif text-xl font-semibold text-walnut">Claim was not approved</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              Check the email we sent for the reason — usually a licence mismatch. You can resubmit with corrected documents.
            </p>
            <Link href="/supplier/license" className="mt-5 inline-block rounded-xl bg-terracotta px-8 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep">
              Resubmit claim
            </Link>
          </>
        ) : (
          <>
            <p className="font-serif text-xl font-semibold text-walnut">No claimed company on this account</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              Claim your company profile with your trade licence — verified companies rank first, get homeowner leads
              passed directly, and unlock this dashboard. Use this same email when claiming.
            </p>
            <Link href="/supplier/license" className="mt-5 inline-block rounded-xl bg-terracotta px-8 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep">
              Claim your profile — free
            </Link>
          </>
        )}
      </Card>
    );
  }

  const { company, leads, bids, projects } = data;

  return (
    <div>
      {/* Company header */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold">{company.name}</h2>
          {company.verified && <Badge tone="green"><BadgeCheck className="mr-1 inline h-3.5 w-3.5" />Verified</Badge>}
          {company.contact_verified && <Badge tone="blue">✓ Contact</Badge>}
          {company.portfolio_verified && <Badge tone="blue">✓ Portfolio</Badge>}
          <span className="ml-auto">
            <Link href={`/companies/${company.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-deep hover:underline">
              Public profile <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-400">
          {company.area}
          {company.rating != null && (
            <span className="ml-3 inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <b className="font-mono text-charcoal">{Number(company.rating).toFixed(1)}</b>
              <span>({company.rating_count} on Google)</span>
            </span>
          )}
        </p>
      </Card>

      {/* Leads */}
      <div className="mb-3 flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-terracotta-deep" strokeWidth={1.75} />
        <h2 className="font-bold">Leads sent to you</h2>
        <span className="text-xs text-gray-400">{leads.length}</span>
      </div>
      {leads.length === 0 ? (
        <Card className="text-center text-sm text-gray-500">
          No direct leads yet. Meanwhile,{" "}
          <Link href="/requests" className="font-semibold text-terracotta-deep underline">quote on open briefs</Link>{" "}
          — verified companies get priority placement.
        </Card>
      ) : (
        <div className="space-y-4">
          {leads.map((l) => (
            <Card key={l.ref}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold">{l.ref}</span>
                <Badge tone={l.status === "new" ? "blue" : "gray"}>{l.status}</Badge>
                <span className="ml-auto text-xs text-gray-400">{new Date(l.created_at).toLocaleDateString("en-GB", { timeZone: "Asia/Dubai", day: "numeric", month: "short" })}</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">{[l.space_type, l.area, l.budget, l.timeline].filter(Boolean).join(" · ") || "—"}</p>
              {l.details && <p className="mt-3 whitespace-pre-line rounded-xl bg-sand p-3 text-sm leading-relaxed text-gray-600">{l.details}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-terracotta-tint/50 p-3 text-sm">
                <b>{l.name}</b>
                {l.phone && (
                  <a href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "").replace(/^0/, "971")}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:brightness-95">
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                )}
                {l.email && <a href={`mailto:${l.email}`} className="font-mono text-xs text-terracotta-deep underline">{l.email}</a>}
                <span className="ml-auto text-[11px] text-gray-400">Respond within 24h — response speed feeds your ranking</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bids */}
      <div className="mb-3 mt-8 flex items-center gap-2">
        <Gavel className="h-4 w-4 text-terracotta-deep" strokeWidth={1.75} />
        <h2 className="font-bold">Your bids on open briefs</h2>
        <span className="text-xs text-gray-400">{bids.length}</span>
        <Link href="/requests" className="ml-auto text-xs font-semibold text-terracotta-deep hover:underline">Open briefs →</Link>
      </div>
      {bids.length === 0 ? (
        <Card className="text-center text-sm text-gray-500">No bids yet — new homeowner briefs are posted on the open board.</Card>
      ) : (
        <div className="space-y-3">
          {bids.map((b, i) => (
            <Card key={i} className="flex flex-wrap items-center gap-3 py-4">
              <span className="font-mono text-xs font-bold text-gray-400">{b.request_ref ?? "—"}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-gray-600">{b.request_scope || b.request_area || ""}</span>
              {b.price_band && <Badge tone="gray">{b.price_band}</Badge>}
              <Badge tone={b.status === "new" ? "blue" : "gray"}>{b.status === "new" ? "with concierge" : b.status}</Badge>
            </Card>
          ))}
        </div>
      )}

      {/* Showcases */}
      <div className="mb-3 mt-8 flex items-center gap-2">
        <Images className="h-4 w-4 text-terracotta-deep" strokeWidth={1.75} />
        <h2 className="font-bold">Your showcases</h2>
        <span className="text-xs text-gray-400">{projects.length}</span>
        <Link href="/supplier/showcase" className="ml-auto text-xs font-semibold text-terracotta-deep hover:underline">Publish a project →</Link>
      </div>
      {projects.length === 0 ? (
        <Card className="text-center text-sm text-gray-500">
          No showcases yet — a published project page ranks on Google under your company name and converts homeowners.
          It&apos;s free.
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((p, i) => (
            <Card key={i} className="flex flex-wrap items-center gap-3 py-4">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{p.title}</span>
              <Badge tone={p.status === "approved" ? "green" : p.status === "pending" ? "amber" : "gray"}>{p.status}</Badge>
              {p.slug && p.status === "approved" && (
                <Link href={`/projects/${p.slug}`} className="text-xs font-semibold text-terracotta-deep hover:underline">View →</Link>
              )}
            </Card>
          ))}
        </div>
      )}

      <Notice tone="blue">
        Standard contract, staged payments and written variation orders are what homeowners on this platform expect —
        working with them is what separates you from the lowball-and-inflate crowd.{" "}
        <Link href="/protection" className="font-semibold underline">See the terms</Link>
      </Notice>
    </div>
  );
}
