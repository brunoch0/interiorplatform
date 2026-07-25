"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, FileUp, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Badge, Card, Notice, PageHeader, Steps } from "@/components/ui";
import { submitClaim } from "./actions";

type CompanyOpt = { id: string; name: string; area: string; verified: boolean };

function FilePick({ label, file, onPick, required }: { label: string; file: File | null; onPick: (f: File | null) => void; required?: boolean }) {
  return (
    <div>
      <p className="text-sm font-medium">{label} {required && <span className="text-xs text-red-500">*</span>}</p>
      {file ? (
        <span className="mt-2 inline-flex items-center gap-2 rounded-lg border border-emerald-400 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {file.name.slice(0, 32)}
          <button type="button" onClick={() => onPick(null)}><X className="h-3.5 w-3.5" /></button>
        </span>
      ) : (
        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-6 text-center hover:border-clay">
          <FileUp className="h-5 w-5 text-clay" strokeWidth={1.75} />
          <span className="mt-1.5 text-sm font-medium">Upload</span>
          <span className="text-xs text-gray-400">PDF, JPG, PNG · max 10MB</span>
          <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
        </label>
      )}
    </div>
  );
}

export default function ClaimForm({ companies }: { companies: CompanyOpt[] }) {
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState<CompanyOpt | null>(null);
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [phone, setPhone] = useState("");
  const [tradeFile, setTradeFile] = useState<File | null>(null);
  const [detFile, setDetFile] = useState<File | null>(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const suggestions = useMemo(() => {
    const n = search.trim().toLowerCase();
    if (!n || company) return [];
    return companies.filter((c) => c.name.toLowerCase().includes(n)).slice(0, 6);
  }, [search, companies, company]);

  const submit = () => {
    setError(null);
    startTransition(async () => {
      try {
        if (!tradeFile) throw new Error("Trade license upload is required.");
        const folder = crypto.randomUUID();
        const up = async (f: File, name: string) => {
          const ext = (f.name.split(".").pop() || "pdf").toLowerCase().replace(/[^a-z0-9]/g, "") || "pdf";
          const path = `${folder}/${name}.${ext}`;
          const { error: e } = await supabaseBrowser.storage.from("licenses").upload(path, f, { contentType: f.type });
          if (e) throw new Error("Upload failed — check file size (max 10MB) and try again.");
          return path;
        };
        const tradePath = await up(tradeFile, "trade");
        const detPath = detFile ? await up(detFile, "det") : null;
        const res = await submitClaim({
          companyId: company?.id ?? null,
          companyName: company?.name ?? search,
          contactName, email, phone,
          tradeLicensePath: tradePath,
          detLicensePath: detPath,
          licenseNumber,
          licenseExpiry: licenseExpiry || null,
          newsletter,
        });
        if (res.ok) setDone(true);
        else setError(res.error);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  };

  if (done)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" strokeWidth={1.75} />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Claim submitted</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
          We verify licences against the official register within 1–2 business days. You&apos;ll get the result by email
          — on approval, your profile shows the <b>Verified</b> badge and ranks first in search.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader
        title="Claim Your Profile"
        desc="Free verification for licensed contractors. Verified profiles rank first, show the Verified badge, and receive homeowner quote requests."
      />
      <Steps items={["Your company", "Licence documents", "Review"]} current={step} />

      {step === 0 && (
        <Card>
          <h2 className="font-bold">Step 1 — Find your company</h2>
          <p className="mt-1 text-sm text-gray-500">Most licensed Dubai contractors are already listed from public sources.</p>
          <div className="mt-4">
            {company ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-terracotta bg-terracotta-tint px-4 py-2 text-sm text-terracotta-deep">
                {company.name} · {company.area}
                {company.verified && <Badge tone="green">Already verified</Badge>}
                <button type="button" onClick={() => { setCompany(null); setSearch(""); }}><X className="h-4 w-4" /></button>
              </span>
            ) : (
              <>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type your company name…"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
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
                <p className="mt-2 text-xs text-gray-400">Not listed? Just type your company name — we&apos;ll create the profile during review.</p>
              </>
            )}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Contact person *"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Work email *"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp / phone"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-gray-500">
            <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 accent-[#C06A45]" />
            Email me when new project briefs are posted and about contractor features (optional — unsubscribe anytime)
          </label>
          <button
            onClick={() => {
              if (!contactName.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setError("Name and a valid work email are required."); return; }
              if (!company && !search.trim()) { setError("Select or type your company name."); return; }
              setError(null); setStep(1);
            }}
            className="mt-5 w-full rounded-xl bg-walnut py-3.5 text-sm font-bold text-cream hover:bg-walnut-deep">
            Continue →
          </button>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </Card>
      )}

      {step === 1 && (
        <Card>
          <h2 className="font-bold">Step 2 — Licence documents</h2>
          <p className="mt-1 text-sm text-gray-500">We check these against the official register. Documents are stored privately and never shown publicly.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FilePick label="Trade licence" file={tradeFile} onPick={setTradeFile} required />
            <FilePick label="DET fit-out licence (if separate)" file={detFile} onPick={setDetFile} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="Licence number (e.g. 887123)"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            <input value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} type="date"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <div className="mt-5 flex gap-2">
            <button onClick={() => setStep(0)} className="rounded-xl border border-gray-300 px-6 py-3.5 text-sm text-gray-600">← Back</button>
            <button
              onClick={() => { if (!tradeFile) { setError("Trade licence upload is required."); return; } setError(null); setStep(2); }}
              className="flex-1 rounded-xl bg-walnut py-3.5 text-sm font-bold text-cream hover:bg-walnut-deep">
              Continue →
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </Card>
      )}

      {step === 2 && (
        <Card>
          <h2 className="font-bold">Step 3 — Review &amp; submit</h2>
          <dl className="mt-4 space-y-2 rounded-xl bg-gray-50 p-5 text-sm">
            <div className="flex justify-between"><dt className="text-gray-400">Company</dt><dd className="font-semibold">{company?.name ?? search}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Contact</dt><dd>{contactName} · {email}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Trade licence</dt><dd>{tradeFile?.name.slice(0, 28)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">DET licence</dt><dd>{detFile?.name.slice(0, 28) ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Licence no. / expiry</dt><dd>{licenseNumber || "—"} · {licenseExpiry || "—"}</dd></div>
          </dl>
          <Notice tone="blue">
            Review takes 1–2 business days. We validate against the National Economic Register; mismatched or expired
            licences are returned with a reason and you can resubmit.
          </Notice>
          <div className="mt-5 flex gap-2">
            <button onClick={() => setStep(1)} className="rounded-xl border border-gray-300 px-6 py-3.5 text-sm text-gray-600">← Back</button>
            <button onClick={submit} disabled={pending}
              className="flex-1 rounded-xl bg-terracotta py-3.5 text-sm font-bold text-cream hover:bg-terracotta-deep disabled:opacity-50">
              {pending ? "Uploading…" : "Submit for verification"}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </Card>
      )}
    </div>
  );
}
