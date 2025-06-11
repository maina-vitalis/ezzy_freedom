import { Toaster as SonnerToast } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/util/ReactQueryProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ezzfreedomandhope.or.ke"),
  title: {
    default:
      "EZZ Freedom and Hope - Mental Health & Addiction Recovery Services in Kenya",
    template: "%s | EZZ Freedom and Hope",
  },
  description:
    "Professional mental health and addiction recovery services in Kenya. Expert counseling for drug addiction, couples therapy, anger management, teenage sessions, and comprehensive mental health support.",
  keywords: [
    "mental health Kenya",
    "addiction recovery",
    "addiction counseling Kenya",
    "drug rehabilitation",
    "couples therapy Kenya",
    "anger management",
    "teenage counseling",
    "mental health awareness",
    "substance abuse treatment",
    "recovery support groups",
    "licensed addiction counselor",
    "Ezra Karanja",
    "mental health foundation",
  ],
  authors: [{ name: "EZZ Freedom and Hope Foundation" }],
  creator: "EZZ Freedom and Hope Foundation",
  publisher: "EZZ Freedom and Hope Foundation",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://ezzfreedomandhope.or.ke",
    siteName: "EZZ Freedom and Hope",
    title: "EZZ Freedom and Hope - Mental Health & Addiction Recovery Services",
    description:
      "Leading mental health foundation in Kenya providing professional addiction recovery, counseling services, and mental health awareness programs.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EZZ Freedom and Hope - Mental Health Services",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EZZ Freedom and Hope - Mental Health & Addiction Recovery",
    description:
      "Professional mental health and addiction recovery services in Kenya. Expert counseling and support programs.",
    creator: "@ezzfreedomandhope",
    images: ["/assets/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ezzfreedomandhope.or.ke",
    languages: {
      "en-KE": "https://ezzfreedomandhope.or.ke",
      "en-US": "https://ezzfreedomandhope.or.ke/en-US",
      "sw-KE": "https://ezzfreedomandhope.or.ke/sw-KE",
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    yandex: "YOUR_YANDEX_VERIFICATION_CODE",
    yahoo: "YOUR_YAHOO_VERIFICATION_CODE",
    other: {
      "msvalidate.01": "YOUR_BING_VERIFICATION_CODE",
    },
  },
  category: "health",
  classification: "Mental Health Services",
  other: {
    "theme-color": "#31B44D",
    "color-scheme": "light dark",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "application-name": "EZZ Freedom and Hope",
    "apple-mobile-web-app-title": "EZZ Freedom",
    "msapplication-TileColor": "#31B44D",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-KE" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Additional SEO meta tags */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#31B44D" />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "EZZ Freedom and Hope Foundation",
              alternateName: "EZZ Freedom and Hope",
              url: "https://ezzfreedomandhope.or.ke",
              logo: "https://ezzfreedomandhope.or.ke/assets/logo.png",
              image: "https://ezzfreedomandhope.or.ke/assets/logo.png",
              description:
                "Mental health awareness initiative and addiction recovery support foundation in Kenya",
              foundingDate: "2004",
              founder: {
                "@type": "Person",
                name: "Ezra Karanja",
                jobTitle: "Licensed Addiction Counselor",
                description:
                  "Founder of EZZ Freedom and Hope Foundation, recovering addict, and mental health advocate",
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "Kenya",
                addressLocality: "Nairobi",
              },
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "Customer Service",
                  url: "https://ezzfreedomandhope.or.ke/contact",
                  availableLanguage: ["English", "Swahili"],
                },
              ],
              sameAs: ["https://chat.whatsapp.com/LguO5OsS1FiGZ7K2iYV6gs"],
              areaServed: {
                "@type": "Country",
                name: "Kenya",
              },
              knowsAbout: [
                "Mental Health",
                "Addiction Recovery",
                "Substance Abuse Treatment",
                "Counseling",
                "Therapy",
                "Mental Health Awareness",
              ],
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Addiction Counseling",
                    description:
                      "Professional addiction recovery counseling services",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Mental Health Support",
                    description:
                      "Comprehensive mental health awareness and support services",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <SonnerToast richColors position="top-right" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
