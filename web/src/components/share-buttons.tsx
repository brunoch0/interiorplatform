"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";
import { SITE_URL } from "@/lib/site";

export default function ShareButtons({ title, path, compact = false }: { title: string; path: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  // SITE_URL on both server and client — window.origin here caused hydration mismatches
  const shareUrl = `${SITE_URL}${path}?utm_source=share&utm_medium=whatsapp`;
  const copyUrl = `${SITE_URL}${path}?utm_source=share&utm_medium=link`;
  const message = `${title} — verified listing on Dubai Interior\n${shareUrl}`;

  const copy = async () => {
    await navigator.clipboard.writeText(copyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url: shareUrl }); } catch { /* dismissed */ }
    } else copy();
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-xl bg-[#25D366] font-bold text-white transition hover:brightness-95 ${compact ? "px-3 py-2 text-xs" : "px-5 py-2.5 text-sm"}`}
      >
        <MessageCircle className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={2} />
        Share on WhatsApp
      </a>
      <button
        onClick={copy}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-gray-200 text-gray-500 transition hover:border-gray-400 ${compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"}`}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
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
