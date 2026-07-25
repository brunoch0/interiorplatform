import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCompanyById, fetchProjectBySlug, projectPhotoUrl } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import ShareButtons from "@/components/share-buttons";
import { Badge, BackLink, Card } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await fetchProjectBySlug(slug);
  if (!p) return {};
  const title = `${p.title} — ${p.area ?? "Dubai"} Renovation Project`;
  const description = `Completed ${p.space_type ?? "renovation"} project in ${p.area ?? "Dubai"}${p.budget_band ? ` · ${p.budget_band}` : ""}${p.duration_weeks ? ` · ${p.duration_weeks} weeks` : ""}. Photos and details published by the contractor.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/projects/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/projects/${slug}`, images: p.photos[0] ? [projectPhotoUrl(p.photos[0])] : undefined },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await fetchProjectBySlug(slug);
  if (!p) notFound();
  const company = p.company_id ? await fetchCompanyById(p.company_id) : null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <BackLink href="/projects" label="All projects" />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-deep">Completed project</p>
      <h1 className="mt-2 text-3xl leading-tight">{p.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {p.area && <Badge tone="blue">{p.area}</Badge>}
        {p.space_type && <Badge tone="gray">{p.space_type}</Badge>}
        {p.budget_band && <Badge tone="gray">{p.budget_band}</Badge>}
        {p.duration_weeks && <Badge tone="gray">{p.duration_weeks} weeks</Badge>}
        <span className="ml-auto"><ShareButtons title={p.title} path={`/projects/${slug}`} compact /></span>
      </div>

      {p.content.length > 0 ? (
        /* Blog-style story: text and photos interleaved as the contractor authored them */
        <div className="mt-8 space-y-6">
          {p.content.map((blk, i) =>
            blk.type === "text" ? (
              <div key={i} className="space-y-3">
                {blk.text.split("\n").filter(Boolean).map((para, j) => (
                  <p key={j} className="text-[15px] leading-relaxed text-gray-600">{para}</p>
                ))}
              </div>
            ) : (
              <figure key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={projectPhotoUrl(blk.path)} alt={blk.caption ?? `${p.title} — photo`}
                  className="w-full rounded-xl object-cover" />
                {blk.caption && <figcaption className="mt-2 text-center text-xs text-gray-400">{blk.caption}</figcaption>}
              </figure>
            ),
          )}
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {p.photos.map((ph, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={ph} src={projectPhotoUrl(ph)} alt={`${p.title} — photo ${i + 1}`}
                className={`w-full rounded-xl object-cover ${i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`} />
            ))}
          </div>
          {p.description && (
            <div className="mt-8 space-y-3 border-t border-gray-300 pt-8">
              {p.description.split("\n").filter(Boolean).map((para, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-gray-600">{para}</p>
              ))}
            </div>
          )}
        </>
      )}

      <Card className="mt-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs text-gray-400">Built by</p>
          <p className="mt-0.5 text-lg font-bold">{company?.name ?? "Listed contractor"}</p>
          {company && <p className="text-xs text-gray-400">{company.area} · {company.categories.slice(0, 3).join(" · ")}</p>}
        </div>
        <div className="flex gap-2">
          {company && (
            <Link href={`/companies/${company.id}`} className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-charcoal hover:border-clay">
              View profile
            </Link>
          )}
          <Link href={company ? `/quote?c=${company.id}` : "/quote"} className="rounded-xl bg-terracotta px-5 py-2.5 text-sm font-bold text-cream hover:bg-terracotta-deep">
            Request a quote
          </Link>
        </div>
      </Card>
    </article>
  );
}
