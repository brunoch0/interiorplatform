import Link from "next/link";
import { contract, fmt } from "@/lib/data";
import { Badge, Card, PageHeader, Stat } from "@/components/ui";

const statusTone: Record<string, "green" | "blue" | "gray" | "amber" | "red"> = {
  Completed: "green", "In Progress": "blue", Pending: "gray", "Awaiting QA": "amber", Disputed: "red",
};

export default function ProjectDashboard() {
  const done = contract.milestones.filter((m) => m.status === "Completed").length;
  const progress = Math.round((done / contract.milestones.length) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Project Management"
        desc={`Al Noor Interiors · Business Bay 3BR Apartment · Started ${contract.startDate}`}
        action={
          <div className="flex gap-2">
            <Link href="/project/dispute" className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">File dispute</Link>
            <Link href="/project/inspection" className="rounded-lg bg-walnut px-4 py-2 text-sm font-bold text-cream hover:bg-walnut-deep">QA schedule</Link>
          </div>
        }
      />

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Stat label="Overall progress" value={`${progress}%`} sub={`${done}/${contract.milestones.length} milestones completed`} tone="good" />
        <Stat label="Escrow balance" value={`AED ${fmt(116000)}`} sub={`Total deposited AED ${fmt(contract.totalAmount)}`} />
        <Stat label="Target completion" value={contract.endDate} sub="Currently on schedule" tone="good" />
        <Stat label="Next inspection" value="Jul 26, 10:00" sub="Electrical & plumbing check" />
      </div>

      <Card>
        <h2 className="mb-5 font-bold">Milestones</h2>
        <div className="space-y-4">
          {contract.milestones.map((m, i) => (
            <div key={m.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 p-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                m.status === "Completed" ? "bg-terracotta text-cream" : m.status === "Awaiting QA" ? "bg-amber-400 text-cream" : "bg-gray-100 text-gray-400"
              }`}>
                {m.status === "Completed" ? "✓" : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{m.name}</p>
                  <Badge tone={statusTone[m.status]}>{m.status}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-gray-400">Due {m.dueDate} · {m.ratio}% payment (AED {fmt((contract.totalAmount * m.ratio) / 100)})</p>
              </div>
              <div className="text-right text-xs">
                <Badge tone={m.escrowStatus === "Released" ? "green" : m.escrowStatus === "On Hold" ? "red" : "gray"}>
                  {m.escrowStatus}
                </Badge>
              </div>
              {m.status === "Awaiting QA" && (
                <Link href="/project/qa-report" className="rounded-lg bg-walnut px-4 py-2 text-xs font-bold text-cream hover:bg-walnut-deep">
                  QA report →
                </Link>
              )}
              {m.status === "Completed" && (
                <Link href="/project/qa-report" className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-500 hover:border-gray-400">
                  View report
                </Link>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-50 pt-5">
          <Link href="/project/checklist" className="text-sm font-medium text-sky-600 hover:underline">Inspector checklist screen →</Link>
          <Link href="/project/complete" className="text-sm font-medium text-emerald-600 hover:underline">Project completion &amp; verified review →</Link>
        </div>
      </Card>
    </div>
  );
}
