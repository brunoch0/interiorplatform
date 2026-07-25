"use client";

import { useMemo, useState, useTransition } from "react";
import { ImagePlus, CheckCircle2, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Card, Notice, PageHeader, Steps } from "@/components/ui";
import { submitShowcase } from "./actions";

type CompanyOpt = { id: string; name: string; area: string };
const spaceTypes = ["Apartment", "Villa", "Commercial"];
const budgets = ["Under AED 50K", "AED 50K–100K", "AED 100K–200K", "AED 200K–500K", "AED 500K+"];

export default function ShowcaseForm({ companies }: { companies: CompanyOpt[] }) {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState<CompanyOpt | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const suggestions = useMemo(() => {
    const n = search.trim().toLowerCase();
    if (!n || company) return [];
    return companies.filter((c) => c.name.toLowerCase().includes(n)).slice(0, 6);
  }, [search, companies, company]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, 8);
    setFiles(next.filter((f) => f.size <= 5 * 1024 * 1024));
  };

  const submit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      setUploading(true);
      try {
        const folder = crypto.randomUUID();
        const paths: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          const ext = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
          const path = `${folder}/${i}.${ext}`;
          const { error: upErr } = await supabaseBrowser.storage.from("projects").upload(path, f, { contentType: f.type });
          if (upErr) throw new Error("Photo upload failed — try smaller images (max 5MB each).");
          paths.push(path);
        }
        const res = await submitShowcase({
          companyId: company?.id ?? null,
          companyName: company?.name ?? String(formData.get("companyName") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          title: String(formData.get("title") ?? ""),
          area: String(formData.get("area") ?? ""),
          spaceType: String(formData.get("spaceType") ?? ""),
          budgetBand: String(formData.get("budgetBand") ?? ""),
          durationWeeks: Number(formData.get("durationWeeks")) || null,
          description: String(formData.get("description") ?? ""),
          photos: paths,
        });
        if (res.ok) setDone(true);
        else setError(res.error);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setUploading(false);
      }
    });
  };

  if (done)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" strokeWidth={1.75} />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Project submitted</h1>
        <p className="mt-2 text-sm text-gray-500">
          Our team reviews every showcase within one business day. Once approved, we&apos;ll email you the live link —
          share it anywhere, it&apos;s your page.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        title="Publish Your Project"
        desc="A free showcase page for your best work — photos, scope and your contact details, visible to homeowners searching in your area."
      />
      <Steps items={["Your company", "Project details", "Review & publish"]} current={1} />

      <form action={submit}>
        <Card className="mb-6">
          <h2 className="mb-1 font-bold">Your company</h2>
          <p className="mb-4 text-xs text-gray-400">Search our directory — most licensed Dubai contractors are already listed.</p>
          {company ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta bg-terracotta-tint px-4 py-2 text-sm text-terracotta-deep">
              {company.name} · {company.area}
              <button type="button" onClick={() => { setCompany(null); setSearch(""); }}><X className="h-4 w-4" /></button>
            </span>
          ) : (
            <>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type your company name…"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
              {suggestions.length > 0 && (
                <div className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-200">
                  {suggestions.map((c) => (
                    <button key={c.id} type="button" onClick={() => setCompany(c)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50">
                      <span>{c.name}</span><span className="text-xs text-gray-400">{c.area}</span>
                    </button>
                  ))}
                </div>
              )}
              <input name="companyName" placeholder="Not listed? Type your company name here"
                className="mt-3 w-full rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm" />
            </>
          )}
        </Card>

        <Card className="mb-6">
          <h2 className="mb-4 font-bold">Project details</h2>
          <input name="title" required minLength={5} placeholder="e.g. Full renovation — 2BR apartment, Marina View Tower"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <input name="area" placeholder="Area (e.g. Dubai Marina)" className="rounded-xl border border-gray-200 px-4 py-3 text-sm sm:col-span-1" />
            <select name="spaceType" className="rounded-xl border border-gray-200 px-4 py-3 text-sm">
              {spaceTypes.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select name="budgetBand" className="rounded-xl border border-gray-200 px-4 py-3 text-sm">
              {budgets.map((b) => <option key={b}>{b}</option>)}
            </select>
            <input name="durationWeeks" type="number" min={1} max={104} placeholder="Weeks" className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <textarea name="description" rows={5} maxLength={4000}
            placeholder="Tell the story: what the client wanted, what you did, materials used, challenges solved. Facts read better than superlatives."
            className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />

          <p className="mt-5 text-sm font-medium">Photos * <span className="text-xs font-normal text-gray-400">(before &amp; after works best · up to 8 · max 5MB each)</span></p>
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center hover:border-clay">
            <ImagePlus className="h-6 w-6 text-clay" strokeWidth={1.75} />
            <span className="mt-2 text-sm font-medium">Add photos</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
              onChange={(e) => addFiles(e.target.files)} />
          </label>
          {files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600">
                  {f.name.slice(0, 24)}
                  <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}><X className="h-3.5 w-3.5" /></button>
                </span>
              ))}
            </div>
          )}
        </Card>

        <Card className="mb-6">
          <h2 className="mb-4 font-bold">Contact for the page</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="email" type="email" required placeholder="work email * (we send the live link here)"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            <input name="phone" placeholder="WhatsApp / phone (shown to clients)"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
        </Card>

        {error && <Notice tone="red">{error}</Notice>}

        <button type="submit" disabled={pending || uploading || files.length === 0}
          className="mt-4 w-full rounded-xl bg-terracotta py-4 text-sm font-bold text-cream transition hover:bg-terracotta-deep disabled:opacity-50">
          {uploading ? "Uploading photos…" : pending ? "Submitting…" : "Submit for review — free"}
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          Reviewed within one business day. We may lightly edit for clarity; you keep full credit and contact placement.
        </p>
      </form>
    </div>
  );
}
