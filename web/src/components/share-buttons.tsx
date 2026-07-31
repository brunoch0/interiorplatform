"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";
import { withUtm } from "@/lib/site";
import { track } from "@/components/analytics";
import { useI18n } from "@/lib/i18n/provider";

export default function ShareButtons({ title, path, compact = false }: { title: string; path: string; compact?: boolean }) {
  const { dict } = useI18n();
  const t = dict.share;
  const [copied, setCopied] = useState(false);
  // withUtm keeps SITE_URL on both server and client — window.origin caused hydration mismatches
  const surface = path.split("/").filter(Boolean)[0] ?? "home";
  const shareUrl = withUtm(path, { source: "share", medium: "whatsapp", content: surface });
  const copyUrl = withUtm(path, { source: "share", medium: "link", content: surface });
  const nativeUrl = withUtm(path, { source: "share", medium: "native", content: surface });
  const message = `${title} — ${t.verifiedListing}\n${shareUrl}`;

  const copy = async () => {
    await navigator.clipboard.writeText(copyUrl);
    track("share", { method: "copy_link", content_type: surface, item_id: path });
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: nativeUrl });
        track("share", { method: "native", content_type: surface, item_id: path });
      } catch { /* dismissed */ }
    } else copy();
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("share", { method: "whatsapp", content_type: surface, item_id: path })}
        className={`inline-flex items-center gap-2 rounded-xl bg-[#25D366] font-bold text-white transition hover:brightness-95 ${compact ? "px-3 py-2 text-xs" : "px-5 py-2.5 text-sm"}`}
      >
        <MessageCircle className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={2} />
        {t.whatsapp}
      </a>
      <button
        onClick={copy}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-gray-200 text-gray-500 transition hover:border-gray-400 ${compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"}`}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? t.copied : t.copy}
      </button>
      <button
        onClick={nativeShare}
        aria-label="Share"
        className="inline-flex items-center rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-gray-400 md:hidden"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
