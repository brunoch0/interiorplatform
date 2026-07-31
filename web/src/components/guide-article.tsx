import Link from "next/link";
import { guides, type Guide } from "@/lib/guides";
import { guideImage } from "@/lib/guide-images";
import { GUIDE_CHROME } from "@/lib/guide-i18n/chrome";
import { LOCALE_META } from "@/lib/i18n";
import { translatedLocalesFor, type GuideLocale } from "@/lib/guide-i18n";
import ShareButtons from "@/components/share-buttons";
import EmailCapture from "@/components/email-capture";
import { BackLink } from "@/components/ui";

/**
 * One renderer for every language. `locale` only changes the chrome and the
 * link prefix — the article text arrives already translated on `g`.
 */
export default function GuideArticle({
  g,
  locale = "en",
  otherSlugs,
}: {
  g: Guide;
  locale?: GuideLocale | "en";
  otherSlugs?: { slug: string; title: string }[];
}) {
  const t = GUIDE_CHROME[locale];
  const prefix = locale === "en" ? "" : `/${locale}`;
  const related =
    otherSlugs ??
    guides.filter((x) => x.slug !== g.slug).map((x) => ({ slug: x.slug, title: x.title }));

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BackLink href={`${prefix}/guides`} label={t.allGuides} />

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">{t.kicker}</p>
      <h1 className="mt-3 text-3xl leading-tight md:text-4xl">{g.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
        <span>{g.readMinutes} {t.minRead}</span>·<span>{t.updated} {g.updated}</span>
        <span className="ml-auto"><ShareButtons title={g.title} path={`${prefix}/guides/${g.slug}`} compact /></span>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={guideImage(g.slug, g.category, 1400)}
        alt={g.title}
        className="mt-6 aspect-[21/9] w-full rounded-2xl object-cover"
      />

      {locale === "en" && translatedLocalesFor(g.slug).length > 0 && (
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="font-semibold uppercase tracking-[0.14em] text-gray-400">Also available in</span>
          {translatedLocalesFor(g.slug).map((l) => (
            <Link
              key={l}
              href={`/${l}/guides/${g.slug}`}
              hrefLang={l}
              className="font-semibold underline decoration-terracotta decoration-2 underline-offset-4 hover:text-charcoal"
            >
              {LOCALE_META[l].label}
            </Link>
          ))}
        </p>
      )}

      {locale !== "en" && (
        <p className="mt-6 rounded-xl border border-gray-200 bg-cream px-4 py-3 text-xs leading-relaxed text-gray-500">
          {t.translatedNotice}{" "}
          <Link href={`/guides/${g.slug}`} className="font-semibold underline decoration-terracotta decoration-2 underline-offset-2">
            {t.readOriginal}
          </Link>
        </p>
      )}

      <div className="mt-8 space-y-4 border-t border-gray-300 pt-8">
        {g.intro.map((p, i) => (
          <p key={i} className="leading-relaxed text-gray-600">{p}</p>
        ))}
      </div>

      {g.officialLinks && (
        <aside className="mt-8 rounded-2xl border border-terracotta/25 bg-sand p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta-deep">{t.official}</p>
          <ul className="mt-3 space-y-3">
            {g.officialLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-charcoal underline decoration-terracotta decoration-2 underline-offset-4 hover:text-terracotta-deep">
                  {l.label} ↗
                </a>
                {l.note && <p className="mt-0.5 text-xs text-gray-500">{l.note}</p>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-gray-400">{t.officialNote}</p>
        </aside>
      )}

      {g.sections.map((s) => (
        <section key={s.h2} className="mt-10">
          <h2 className="text-xl font-bold">{s.h2}</h2>
          <div className="mt-3 space-y-3">
            {s.paragraphs.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-gray-600">{p}</p>
            ))}
          </div>
          {s.list && (
            <ul className="mt-3 space-y-1.5 pl-5 text-[15px] leading-relaxed text-gray-600">
              {s.list.map((li, i) => (
                <li key={i} className="list-disc">{li}</li>
              ))}
            </ul>
          )}
          {s.table && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-cream">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
                    {s.table.headers.map((h) => (
                      <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {s.table.rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((c, j) => (
                        <td key={j} className={`px-4 py-2.5 ${j > 0 ? "font-mono text-gray-600" : "text-gray-700"}`}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}

      <section className="mt-10">
        <h2 className="text-xl font-bold">{t.faqTitle}</h2>
        <div className="mt-4 space-y-4">
          {g.faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-gray-200 bg-cream p-4">
              <p className="font-semibold">{f.q}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <EmailCapture source={`guide:${g.slug}`} />
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-walnut p-8 text-cream md:flex-row md:items-center">
        <div>
          <p className="font-serif text-xl">{t.ctaTitle}</p>
          <p className="mt-1 text-sm text-slate-300">{t.ctaBody}</p>
        </div>
        <Link href="/quote" className="shrink-0 rounded-xl bg-terracotta px-6 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep">
          {t.ctaButton}
        </Link>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t.moreGuides}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {related.map((x) => (
            <Link key={x.slug} href={`${prefix}/guides/${x.slug}`} className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:border-clay hover:text-charcoal">
              {x.title.split("—")[0].split(":")[0].trim()}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
