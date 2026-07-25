import Link from "next/link";

export default function DemoBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs leading-relaxed text-amber-800">
      <b>Preview with sample data</b> — this is how quote comparison, escrow, milestone tracking and QA reports will
      work. Launching in phases.{" "}
      <Link href="/quote" className="font-bold underline">Request real quotes →</Link>
    </div>
  );
}
