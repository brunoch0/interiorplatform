import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Dubai Interior — Trusted Interior Marketplace for Dubai",
  description: "Compare verified Dubai interior contractors by hard data — schedule compliance, extra-charge history, approval speed — and manage your project safely with escrow and professional QA inspections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${newsreader.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-sand text-charcoal antialiased">
        <Nav />
        <main>{children}</main>
        <footer className="mt-20 border-t border-gray-200 bg-cream py-10">
          <div className="mx-auto max-w-6xl px-4 text-xs text-gray-400">
            <p className="font-semibold text-gray-500">Dubai Interior · Growtoday Holdings FZE</p>
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
