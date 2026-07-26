import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Nav from "@/components/nav";
import { SITE_NAME, SITE_URL, areaSlug } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dubai Interior — Compare 649 Licensed Fit-Out Companies by Real Data",
    template: "%s | Dubai Interior",
  },
  description:
    "Find interior fit-out contractors in Dubai by evidence, not star ratings — schedule compliance, extra-charge history, approval speed. Free quotes from up to 5 licensed companies.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_AE",
  },
  twitter: { card: "summary_large_image" },
  keywords: [
    "interior fit out dubai", "renovation company dubai", "interior design company dubai",
    "villa renovation dubai", "apartment renovation dubai", "fit out contractor dubai",
  ],
};

const footerAreas = ["Business Bay", "Dubai Marina", "Downtown Dubai", "Al Quoz", "JLT", "Al Barsha", "Jumeirah", "Deira"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${newsreader.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-sand text-charcoal antialiased">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CV1WNNG7SM" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CV1WNNG7SM');`}
        </Script>
        <Nav />
        <main>{children}</main>
        <footer className="mt-20 border-t border-gray-200 bg-cream py-12">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
            <div>
              <p className="font-serif text-lg font-semibold text-walnut">Dubai Interior<span className="text-terracotta">.</span></p>
              <p className="mt-3 text-xs leading-relaxed text-gray-400">
                All contractor metrics are quantitative figures derived from verified reviews — no subjective ratings.
                We comply with UAE federal law including defamation regulations. Escrow payments arrive in phases
                following CBUAE regulatory review.
              </p>
              <p className="mt-3 text-xs text-gray-500">Growtoday Holdings FZE · Dubai, UAE</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Contractors by area</p>
              <ul className="mt-3 grid grid-cols-2 gap-1.5 text-sm">
                {footerAreas.map((a) => (
                  <li key={a}>
                    <Link href={`/areas/${areaSlug(a)}`} className="text-gray-500 hover:text-terracotta-deep">
                      {a}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Get started</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href="/companies" className="text-gray-500 hover:text-terracotta-deep">Browse all contractors</Link></li>
                <li><Link href="/consult" className="text-gray-500 hover:text-terracotta-deep">Free consultation</Link></li>
                <li><Link href="/quote" className="text-gray-500 hover:text-terracotta-deep">Request free quotes</Link></li>
                <li><Link href="/protection" className="text-gray-500 hover:text-terracotta-deep">How you&apos;re protected</Link></li>
                <li><Link href="/report" className="text-gray-500 hover:text-terracotta-deep">Report a contractor issue</Link></li>
                <li><Link href="/guides" className="text-gray-500 hover:text-terracotta-deep">Renovation guides</Link></li>
                <li><Link href="/requests" className="text-gray-500 hover:text-terracotta-deep">Open project briefs</Link></li>
                <li><Link href="/supplier/license" className="text-gray-500 hover:text-terracotta-deep">Claim your company profile</Link></li>
                <li><Link href="/supplier/showcase" className="text-gray-500 hover:text-terracotta-deep">Publish your project (free)</Link></li>
              </ul>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
