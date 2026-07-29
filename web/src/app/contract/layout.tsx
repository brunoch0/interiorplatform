import DemoBanner from "@/components/demo-banner";

export const metadata = { robots: { index: false, follow: false } };

export default function ContractLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
