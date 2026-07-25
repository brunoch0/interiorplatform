"use client";

import { useState, useTransition } from "react";
import { projectPhotoUrl } from "@/lib/db";
import { Badge, Card, PageHeader } from "@/components/ui";
import { reviewProject } from "./actions";

export type AdminProject = {
  id: string;
  title: string;
  status: string;
  slug: string | null;
  area: string | null;
  space_type: string | null;
  budget_band: string | null;
  duration_weeks: number | null;
  description: string | null;
  photos: string[];
  company_id: string | null;
  company_name: string | null;
  company_name_submitted: string | null;
  contact_email: string;
  contact_phone: string | null;
  created_at: string;
};

export default function ProjectsModeration({ projects: initial, adminKey }: { projects: AdminProject[]; adminKey: string }) {
  const [projects, setProjects] = useState(initial);
  const [, startTransition] = useTransition();

  const act = (id: string, action: "publish" | "reject") => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: action === "publish" ? "published" : "rejected" } : p)));
    startTransition(async () => {
      await reviewProject(adminKey, id, action);
    });
  };

  const pending = projects.filter((p) => p.status === "pending");
  const rest = projects.filter((p) => p.status !== "pending");

  return (
    <div>
      <PageHeader title="Showcases" desc={`${pending.length} awaiting review · ${rest.length} processed`} />
      {[...pending, ...rest].map((p) => (
        <Card key={p.id} className="mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold">{p.title}</p>
            <Badge tone={p.status === "published" ? "green" : p.status === "rejected" ? "red" : "amber"}>{p.status}</Badge>
            <span className="ml-auto text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString("en-GB")}</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {p.company_name ?? p.company_name_submitted ?? "No company"} · {p.area} · {p.budget_band} ·{" "}
            <span className="font-mono">{p.contact_email}</span>{p.contact_phone && <span className="font-mono"> · {p.contact_phone}</span>}
          </p>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {p.photos.map((ph) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={ph} src={projectPhotoUrl(ph)} alt="" className="h-24 w-32 shrink-0 rounded-lg object-cover" />
            ))}
          </div>
          {p.description && <p className="mt-3 line-clamp-3 text-sm text-gray-600">{p.description}</p>}
          {p.status === "pending" && (
            <div className="mt-4 flex gap-2">
              <button onClick={() => act(p.id, "publish")} className="rounded-lg bg-terracotta px-5 py-2.5 text-sm font-bold text-cream hover:bg-terracotta-deep">
                Publish
              </button>
              <button onClick={() => act(p.id, "reject")} className="rounded-lg border border-red-200 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50">
                Reject
              </button>
            </div>
          )}
          {p.status === "published" && p.slug && (
            <a href={`/projects/${p.slug}`} target="_blank" className="mt-3 inline-block text-sm font-semibold text-terracotta-deep hover:underline">
              View live page →
            </a>
          )}
        </Card>
      ))}
      {projects.length === 0 && <Card className="text-center text-sm text-gray-500">No submissions yet — share /supplier/showcase with contractors.</Card>}
    </div>
  );
}
