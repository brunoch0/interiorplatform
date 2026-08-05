"use client";

import Link from "next/link";
import { areaSlug } from "@/lib/site";
import { useI18n } from "@/lib/i18n/provider";
import LanguageSwitcher from "@/components/language-switcher";

const footerAreas = ["Business Bay", "Dubai Marina", "Downtown Dubai", "Al Quoz", "JLT", "Al Barsha", "Jumeirah", "Deira"];

export default function Footer() {
  const { dict } = useI18n();
  const t = dict.footer;
  const links: [string, string][] = [
    ["/companies", t.browse],
    ["/consult", t.consult],
    ["/calculator", t.calculator],
    ["/quote", t.quotes],
    ["/protection", t.protection],
    ["/report", t.report],
    ["/guides", t.guides],
    ["/rankings", t.rankings],
    ["/areas", t.areas],
    ["/feedback", t.feedback],
    ["/requests", t.openBriefs],
    ["/supplier/license", t.claim],
    ["/supplier/showcase", t.publish],
  ];

  return (
    <footer className="mt-20 border-t border-gray-200 bg-cream py-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-semibold text-walnut">OnePass Interior<span className="text-terracotta">.</span></p>
          <p className="mt-3 text-xs leading-relaxed text-gray-400">{t.legal}</p>
          <p className="mt-3 text-xs text-gray-500">{t.company}</p>
          <div className="mt-4"><LanguageSwitcher /></div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t.byArea}</p>
          <ul className="mt-3 grid grid-cols-2 gap-1.5 text-sm">
            {footerAreas.map((a) => (
              <li key={a}>
                <Link href={`/areas/${areaSlug(a)}`} className="text-gray-500 hover:text-terracotta-deep">{a}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t.getStarted}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {links.map(([href, label]) => (
              <li key={href}><Link href={href} className="text-gray-500 hover:text-terracotta-deep">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
