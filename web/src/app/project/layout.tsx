import DemoBanner from "@/components/demo-banner";

export const metadata = { robots: { index: false, follow: false } };

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
