import DemoBanner from "@/components/demo-banner";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
