import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import SupplierDashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Contractor Dashboard — Your Leads, Bids & Showcases",
  robots: { index: false },
};

export default function SupplierDashboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        title="Contractor dashboard"
        desc="Homeowner leads sent to you, your bids on open briefs, and your showcase pages — unlocked by claiming your profile."
      />
      <SupplierDashboardClient />
    </div>
  );
}
