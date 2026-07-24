import Link from "next/link";
import { BackLink, Card, Notice, Steps } from "@/components/ui";

export default function SupplierSignup() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <BackLink href="/onboarding" label="Back to role selection" />
      <h1 className="text-2xl font-bold">Contractor Sign-up</h1>
      <p className="mt-2 mb-8 text-sm text-gray-500">Only interior / fit-out companies holding a valid DET license can be verified.</p>
      <Steps items={["Contact person", "Company matching", "License verification"]} current={0} />
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Contact person</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="Full name" />
          </div>
          <div>
            <label className="text-sm font-medium">Company name (English)</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="e.g. Al Noor Interiors LLC" />
            <p className="mt-1.5 text-xs text-gray-400">We&apos;ll search existing listings by this name and connect you to the Claim flow.</p>
          </div>
          <div>
            <label className="text-sm font-medium">Business email</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="contact@company.ae" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="+971 4 000 0000" />
          </div>
          <Notice>
            Companies not yet listed will get a new profile. Please have your trade license and DET fit-out license documents ready (PDF/JPG).
          </Notice>
          <Link href="/supplier/license" className="block w-full rounded-xl bg-sky-600 py-3.5 text-center text-sm font-bold text-white transition hover:bg-sky-700">
            Check company match →
          </Link>
        </div>
      </Card>
    </div>
  );
}
