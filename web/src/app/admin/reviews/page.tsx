import { Badge, Card, Notice, PageHeader } from "@/components/ui";

const flagged = [
  {
    id: "f1",
    company: "Desert Oak Design",
    author: "Anonymous user",
    date: "2026-07-22",
    excerpt: "This company is a total scam. Never ever use them...",
    reason: "Emotive defamatory language — potential UAE defamation law violation (auto keyword detection)",
    risk: "High",
  },
  {
    id: "f2",
    company: "Marina Fitout",
    author: "Kim J.",
    date: "2026-07-20",
    excerpt: "I contacted the manager, Mr. ○○○, at 05X-XXX-XXXX but...",
    reason: "Contains personal data (name & phone number) — masking required",
    risk: "Medium",
  },
];

export default function AdminReviews() {
  return (
    <div>
      <PageHeader
        title="Review & Reputation Monitoring"
        desc="Review content auto-flagged by keyword filters and repeat-pattern detection."
        action={
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">Export CSV</button>
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">Compliance report (PDF)</button>
          </div>
        }
      />
      <Notice tone="red">
        2 auto-flagged items pending — withheld from publication per UAE defamation-law compliance rules. Review and decide: delete, edit, or publish.
      </Notice>

      <div className="mt-6 space-y-4">
        {flagged.map((f) => (
          <Card key={f.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold">{f.company}</p>
                  <Badge tone={f.risk === "High" ? "red" : "amber"}>Risk: {f.risk}</Badge>
                  <Badge tone="gray">Withheld</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-400">{f.author} · {f.date}</p>
                <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm italic text-gray-500">&ldquo;{f.excerpt}&rdquo;</p>
                <p className="mt-2 text-xs text-red-500">Detection reason: {f.reason}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="rounded-lg bg-red-500 px-5 py-2 text-sm font-bold text-cream hover:bg-red-600">Delete</button>
                <button className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-500 hover:border-gray-400">Request edit</button>
                <button className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-500 hover:border-gray-400">Allow publication</button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="mb-4 font-bold">Monitoring stats (this month)</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-center">
          {[
            ["87", "New verified reviews"],
            ["5", "Auto-flagged"],
            ["2", "Deleted"],
            ["1", "Blacklist warning"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl bg-gray-50 p-4">
              <p className="text-2xl font-black">{v}</p>
              <p className="mt-1 text-xs text-gray-400">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Contractors below the reputation threshold are auto-demoted in listings; repeated violations trigger blacklist notifications. Periodic reports auto-generate and send on the 1st of each month.
        </p>
      </Card>
    </div>
  );
}
