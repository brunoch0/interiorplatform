import Link from "next/link";
import type { Metadata } from "next";
import { fetchProjects, projectPhotoUrl } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { Badge, Card, PageHeader } from "@/components/ui";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Real Renovation Projects in Dubai — Before & After",
  description: "Completed fit-out and renovation projects across Dubai, published by the contractors who built them — with area, budget band and duration.",
  alternates: { canonical: `${SITE_URL}/projects` },
};

export default async function ProjectsPage() {
  const projects = await fetchProjects();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Real Projects"
        desc="Completed work across Dubai, published by the contractors who built it — with budget band and duration, not just pretty photos."
        action={
          <Link href="/supplier/showcase" className="rounded-xl bg-walnut px-5 py-2.5 text-sm font-bold text-cream hover:bg-walnut-deep">
            Contractor? Publish yours →
          </Link>
        }
      />

      {projects.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="font-serif text-xl">First showcases are in review</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Contractors are submitting their best work now. If you run a fit-out company, publish your project free —
            it takes five minutes.
          </p>
          <Link href="/supplier/showcase" className="mt-5 inline-block rounded-xl bg-terracotta px-6 py-3 text-sm font-bold text-cream hover:bg-terracotta-deep">
            Publish a project →
          </Link>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`}>
              <Card className="h-full p-0 transition hover:shadow-md">
                {p.photos[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={projectPhotoUrl(p.photos[0])} alt={p.title} className="aspect-[4/3] w-full rounded-t-2xl object-cover" />
                )}
                <div className="p-5">
                  <h2 className="line-clamp-2 font-bold leading-snug">{p.title}</h2>
                  <p className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
                    {p.area && <Badge tone="blue">{p.area}</Badge>}
                    {p.budget_band && <Badge tone="gray">{p.budget_band}</Badge>}
                    {p.duration_weeks && <Badge tone="gray">{p.duration_weeks} weeks</Badge>}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
