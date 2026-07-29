import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import AccountClient from "./account-client";

export const metadata: Metadata = {
  title: "My Page — Your Consultations & Quote Requests",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        title="My page"
        desc="Your consultations, quote requests and follow-ups — in one place."
      />
      <AccountClient />
    </div>
  );
}
