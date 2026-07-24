import Link from "next/link";
import { fmt } from "@/lib/data";
import { BackLink, Card, Notice, Steps } from "@/components/ui";

export default function QuoteConfirm() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <BackLink href="/quote/compare" label="Back to comparison" />
      <Steps items={["Compare quotes", "Confirm contractor", "Sign contract", "Escrow deposit"]} current={1} />

      <Card>
        <h1 className="text-xl font-bold">Confirm your contractor</h1>
        <p className="mt-1 text-sm text-gray-500">The contract process will start with the details below.</p>

        <div className="mt-6 rounded-xl bg-gray-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Al Noor Interiors</p>
              <p className="text-xs text-gray-400">Al Noor Interiors LLC · Business Bay</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">AED {fmt(145000)}</p>
              <p className="text-xs text-gray-400">Est. 12 weeks</p>
            </div>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-gray-400">Scope</dt><dd className="font-medium">3BR apartment full renovation (kitchen extension, 2 bathrooms)</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">Planned start</dt><dd className="font-medium">2026-08-10</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">DM approval handling</dt><dd className="font-medium">Included</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">Payment method</dt><dd className="font-medium text-emerald-600">Escrow (4 milestones)</dd></div>
        </dl>

        <Notice tone="blue">
          On confirmation, the other contractors receive a polite decline notification automatically. A draft contract is generated and has no legal effect until both parties e-sign.
        </Notice>

        <Link href="/contract" className="mt-6 block w-full rounded-xl bg-emerald-500 py-4 text-center text-sm font-bold text-white hover:bg-emerald-600">
          Confirm and draft the contract →
        </Link>
      </Card>
    </div>
  );
}
