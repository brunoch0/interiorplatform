import Link from "next/link";
import { BackLink, Card, Notice, Steps } from "@/components/ui";

export default function ConsumerSignup() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <BackLink href="/onboarding" label="Back to role selection" />
      <h1 className="text-2xl font-bold">Homeowner Sign-up</h1>
      <p className="mt-2 mb-8 text-sm text-gray-500">You can sign up whether or not you currently reside in Dubai.</p>
      <Steps items={["Basic info", "Contact verification", "Done"]} current={0} />
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="Enter your legal name" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium">Mobile number (UAE / international)</label>
            <div className="mt-1.5 flex gap-2">
              <select className="rounded-xl border border-gray-200 px-3 py-3 text-sm">
                <option>+971</option>
                <option>+82</option>
              </select>
              <input className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="50 123 4567" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Space type of interest</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Apartment", "Villa", "Commercial", "Not sure yet"].map((t) => (
                <label key={t} className="cursor-pointer rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-700">
                  <input type="checkbox" className="hidden" /> {t}
                </label>
              ))}
            </div>
          </div>
          <Notice tone="blue">Identity verification is required at sign-up, and proof of project completion is required to post verified reviews.</Notice>
          <Link href="/companies" className="block w-full rounded-xl bg-slate-900 py-3.5 text-center text-sm font-bold text-white transition hover:bg-slate-700">
            Continue →
          </Link>
        </div>
      </Card>
    </div>
  );
}
