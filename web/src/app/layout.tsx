import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Nav from "@/components/nav";
import BetaBar from "@/components/beta-bar";
import Footer from "@/components/footer";
import I18nProvider from "@/lib/i18n/provider";
import { GA_ID, SITE_NAME, SITE_URL } from "@/lib/site";
import PageViewTracker from "@/components/analytics";
import { Suspense } from "react";

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
    default: "OnePass Interior — Dubai Renovation Contractors, Compared by Data",
    template: "%s · OnePass Interior",
  },
  description:
    "Find Dubai interior fit-out contractors by evidence, not star ratings: schedule compliance, extra-charge history, approval speed. Free quotes from licensed firms.",
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
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                window.gtag('js', new Date());
                window.gtag('config', '${GA_ID}', { send_page_view: false });`}
            </Script>
          </>
        )}
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: SITE_NAME,
                alternateName: "Dubai Interior",
                url: SITE_URL,
                logo: `${SITE_URL}/icon.svg`,
                areaServed: { "@type": "City", name: "Dubai" },
                address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
                parentOrganization: { "@type": "Organization", name: "Growtoday Holdings FZE" },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL,
                inLanguage: "en",
                potentialAction: {
                  "@type": "SearchAction",
                  target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/companies?q={search_term_string}` },
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
        <I18nProvider>
          <BetaBar />
          <Nav openCount={openCount} />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
