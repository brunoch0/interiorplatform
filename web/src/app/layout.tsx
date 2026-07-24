import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "DubaiInterior — Trusted Interior Marketplace for Dubai",
  description: "Compare verified Dubai interior contractors by hard data — schedule compliance, extra-charge history, approval speed — and manage your project safely with escrow and professional QA inspections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-slate-900 antialiased">
        <Nav />
        <main>{children}</main>
        <footer className="mt-20 border-t border-gray-100 bg-white py-10">
          <div className="mx-auto max-w-6xl px-4 text-xs text-gray-400">
            <p className="font-semibold text-gray-500">DubaiInterior · Growtoday Holdings FZE</p>
            <p className="mt-2 leading-relaxed">
              All contractor metrics on this platform are quantitative figures derived from verified reviews and contain no subjective ratings.
              We comply with UAE federal law including defamation regulations. Escrow payments will be introduced in phases following CBUAE regulatory review.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
