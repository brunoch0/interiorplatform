import DemoBanner from "@/components/demo-banner";

export default function ContractLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
