"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ImagePlus, CheckCircle2, Type, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Card, Notice, PageHeader, Steps } from "@/components/ui";
import { submitShowcase, type ContentBlock } from "./actions";

type CompanyOpt = { id: string; name: string; area: string };
const spaceTypes = ["Apartment", "Villa", "Commercial"];
const budgets = ["Under AED 50K", "AED 50K–100K", "AED 100K–200K", "AED 200K–500K", "AED 500K+"];

type EditorBlock =
  | { id: string; type: "text"; text: string }
  | { id: string; type: "image"; file: File; preview: string; caption: string };

const MAX_IMAGES = 12;

export default function ShowcaseForm({ companies }: { companies: CompanyOpt[] }) {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState<CompanyOpt | null>(null);
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: crypto.randomUUID(), type: "text", text: "" },
  ]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const suggestions = useMemo(() => {
    const n = search.trim().toLowerCase();
    if (!n || company) return [];
    return companies.filter((c) => c.name.toLowerCase().includes(n)).slice(0, 6);
  }, [search, companies, company]);

  const imageCount = blocks.filter((b) => b.type === "image").length;

  const addText = () =>
    setBlocks((b) => [...b, { id: crypto.randomUUID(), type: "text", text: "" }]);

  const addImages = (list: FileList | null) => {
    if (!list) return;
    const room = MAX_IMAGES - imageCount;
    const incoming = Array.from(list)
      .filter((f) => f.size <= 5 * 1024 * 1024)
      .slice(0, room)
      .map((file) => ({
        id: crypto.randomUUID(),
        type: "image" as const,
        file,
        preview: URL.createObjectURL(file),
        caption: "",
      }));
    setBlocks((b) => [...b, ...incoming]);
  };

  const updateBlock = (id: string, patch: Partial<{ text: string; caption: string }>) =>
    setBlocks((b) => b.map((blk) => (blk.id === id ? ({ ...blk, ...patch } as EditorBlock) : blk)));

  const removeBlock = (id: string) => setBlocks((b) => b.filter((blk) => blk.id !== id));

  const moveBlock = (id: string, dir: -1 | 1) =>
    setBlocks((b) => {
      const i = b.findIndex((blk) => blk.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= b.length) return b;
      const next = [...b];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const submit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      setUploading(true);
      try {
        const folder = crypto.randomUUID();
        const content: ContentBlock[] = [];
        const paths: string[] = [];
        let n = 0;
        for (const blk of blocks) {
          if (blk.type === "text") {
            if (blk.text.trim()) content.push({ type: "text", text: blk.text.trim() });
            continue;
          }
          const ext = (blk.file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
          const path = `${folder}/${n++}.${ext}`;
          const { error: upErr } = await supabaseBrowser.storage
            .from("projects")
            .upload(path, blk.file, { contentType: blk.file.type });
          if (upErr) throw new Error("Photo upload failed — try smaller images (max 5MB each).");
          paths.push(path);
          content.push({ type: "image", path, caption: blk.caption.trim() || undefined });
        }
        const description = blocks
          .filter((b): b is Extract<EditorBlock, { type: "text" }> => b.type === "text")
          .map((b) => b.text.trim())
          .filter(Boolean)
          .join("\n\n");
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
          description,
          photos: paths,
          content,
          newsletter: formData.get("newsletter") != null,
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
        desc="A free showcase page for your best work — written like a blog post, with photos between paragraphs, visible to homeowners searching in your area."
      />
      <Steps items={["Your company", "Project story", "Review & publish"]} current={1} />

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
        </Card>

        <Card className="mb-6">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-bold">Project story</h2>
            <span className="text-xs text-gray-400">{imageCount}/{MAX_IMAGES} photos</span>
          </div>
          <p className="mb-4 text-xs text-gray-400">
            Write it like a blog post — paragraphs and photos in any order. Before &amp; after pairs with captions read best.
          </p>

          <div className="space-y-3">
            {blocks.map((blk, i) => (
              <div key={blk.id} className="group relative rounded-xl border border-gray-200 p-3">
                <div className="absolute -top-2.5 right-3 hidden gap-1 group-hover:flex">
                  <button type="button" onClick={() => moveBlock(blk.id, -1)} disabled={i === 0}
                    className="rounded-md border border-gray-200 bg-white p-1 text-gray-400 hover:text-charcoal disabled:opacity-30">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => moveBlock(blk.id, 1)} disabled={i === blocks.length - 1}
                    className="rounded-md border border-gray-200 bg-white p-1 text-gray-400 hover:text-charcoal disabled:opacity-30">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => removeBlock(blk.id)}
                    className="rounded-md border border-gray-200 bg-white p-1 text-gray-400 hover:text-red-500">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {blk.type === "text" ? (
                  <textarea
                    value={blk.text}
                    onChange={(e) => updateBlock(blk.id, { text: e.target.value })}
                    rows={3}
                    maxLength={4000}
                    placeholder="Tell this part of the story: what the client wanted, what you did, materials, challenges solved…"
                    className="w-full resize-y rounded-lg border-0 px-1 py-1 text-sm focus:ring-0"
                  />
                ) : (
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={blk.preview} alt="" className="max-h-72 w-full rounded-lg object-cover" />
                    <input
                      value={blk.caption}
                      onChange={(e) => updateBlock(blk.id, { caption: e.target.value })}
                      maxLength={200}
                      placeholder="Caption (optional) — e.g. Kitchen, after. Custom oak veneer cabinetry."
                      className="mt-2 w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button type="button" onClick={addText}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:border-gray-400">
              <Type className="h-3.5 w-3.5" /> Add paragraph
            </button>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:border-clay">
              <ImagePlus className="h-3.5 w-3.5 text-clay" /> Add photos
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
                onChange={(e) => { addImages(e.target.files); e.target.value = ""; }} />
            </label>
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="mb-4 font-bold">Contact for the page</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="email" type="email" required placeholder="work email * (we send the live link here)"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            <input name="phone" placeholder="WhatsApp / phone (shown to clients)"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-gray-500">
            <input type="checkbox" name="newsletter" defaultChecked className="mt-0.5 h-3.5 w-3.5 accent-[#C06A45]" />
            Email me when new project briefs are posted and about contractor features (optional — unsubscribe anytime)
          </label>
        </Card>

        {error && <Notice tone="red">{error}</Notice>}

        <button type="submit" disabled={pending || uploading || imageCount === 0}
          className="mt-4 w-full rounded-xl bg-terracotta py-4 text-sm font-bold text-cream transition hover:bg-terracotta-deep disabled:opacity-50">
          {uploading ? "Uploading photos…" : pending ? "Submitting…" : imageCount === 0 ? "Add at least one photo to publish" : "Submit for review — free"}
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          Reviewed within one business day. We may lightly edit for clarity; you keep full credit and contact placement.
        </p>
      </form>
    </div>
  );
}
