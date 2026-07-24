import { Badge, Card, FileDrop, Notice, PageHeader, Placeholder } from "@/components/ui";

export default function SupplierProfile() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        title="Profile & Portfolio"
        desc="Registered content appears on your public profile after operator moderation."
        action={<button className="rounded-lg bg-walnut px-5 py-2.5 text-sm font-bold text-cream hover:bg-walnut-deep">Save changes</button>}
      />

      <Card className="mb-6">
        <h2 className="mb-4 font-bold">Basic information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Specialties</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Full Renovation", "Kitchen", "Bathroom", "Commercial", "Smart Home"].map((c, i) => (
                <label key={c} className="cursor-pointer rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 has-[:checked]:text-sky-700">
                  <input type="checkbox" className="hidden" defaultChecked={i < 3} /> {c}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Typical budget range</label>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <input className="w-32 rounded-xl border border-gray-200 px-4 py-2.5" defaultValue="AED 80,000" />
              <span className="text-gray-400">~</span>
              <input className="w-32 rounded-xl border border-gray-200 px-4 py-2.5" defaultValue="AED 250,000" />
            </div>
            <label className="mt-4 block text-sm font-medium">Service area</label>
            <input className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" defaultValue="All Dubai (based in Business Bay)" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium">Company introduction <span className="text-xs text-gray-400">(max 1,000 chars)</span></label>
          <textarea rows={3} maxLength={1000} className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" defaultValue="15 years in Dubai with a dedicated DM approval team. Premium fit-out specialist with Korean-speaking consultants." />
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Portfolio photos <span className="ml-1 text-xs font-normal text-gray-400">42/50</span></h2>
          <span className="text-xs text-gray-400">JPG·PNG · max 10MB each · drag to reorder</span>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
          <div className="relative">
            <Placeholder label="COVER" hue={200} />
            <Badge tone="navy">Cover image</Badge>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative">
              <Placeholder label={i % 2 ? "AFTER" : "BEFORE"} hue={180 + i * 25} />
              <Badge tone="green">Approved</Badge>
            </div>
          ))}
          {[4, 5, 6].map((i) => (
            <div key={i} className="relative opacity-70">
              <Placeholder label="In review" hue={40} />
              <Badge tone="amber">Awaiting moderation</Badge>
            </div>
          ))}
          <FileDrop label="Add photos" hint="Before & after recommended" />
        </div>
        <Notice tone="blue">Photos awaiting moderation are not shown on your public profile until approved.</Notice>
      </Card>
    </div>
  );
}
