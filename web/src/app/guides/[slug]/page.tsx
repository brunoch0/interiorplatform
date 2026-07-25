import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";
import ShareButtons from "@/components/share-buttons";
import EmailCapture from "@/components/email-capture";
import { BackLink } from "@/components/ui";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `${SITE_URL}/guides/${g.slug}` },
    openGraph: { title: g.title, description: g.description, url: `${SITE_URL}/guides/${g.slug}`, type: "article" },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    dateModified: g.updated,
    author: { "@type": "Organization", name: "Onepass Interior" },
    publisher: { "@type": "Organization", name: "Onepass Interior", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/guides/${g.slug}`,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: g.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BackLink href="/guides" label="All guides" />

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">Dubai renovation guide</p>
      <h1 className="mt-3 text-3xl leading-tight md:text-4xl">{g.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
        <span>{g.readMinutes} min read</span>·<span>Updated {g.updated}</span>
        <span className="ml-auto"><ShareButtons title={g.title} path={`/guides/${g.slug}`} compact /></span>
      </div>

      <div className="mt-8 space-y-4 border-t border-gray-300 pt-8">
        {g.intro.map((p, i) => (
          <p key={i} className="leading-relaxed text-gray-600">{p}</p>
        ))}
      </div>

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
        <h2 className="text-xl font-bold">Frequently asked questions</h2>
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
          <p className="font-serif text-xl">Ready to get real numbers for your project?</p>
          <p className="mt-1 text-sm text-slate-300">Send one brief — get quotes from up to 5 licensed Dubai contractors. Free.</p>
        </div>
        <Link href="/quote" className="shrink-0 rounded-xl bg-terracotta px-6 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep">
          Request quotes →
        </Link>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">More guides</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {guides.filter((x) => x.slug !== g.slug).map((x) => (
            <Link key={x.slug} href={`/guides/${x.slug}`} className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:border-clay hover:text-charcoal">
              {x.title.split("—")[0].split(":")[0].trim()}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
