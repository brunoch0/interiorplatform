import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import I18nProvider from "@/lib/i18n/provider";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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

async function fetchOpenCount(): Promise<number> {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await supabase.rpc("public_open_requests");
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const openCount = await fetchOpenCount();
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
        <I18nProvider>
          <Nav openCount={openCount} />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
