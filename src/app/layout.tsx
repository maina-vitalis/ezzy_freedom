import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToast } from "@/components/ui/sonner";
import QueryProvider from "@/util/ReactQueryProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Ezz Freedom and Hope - Mental Health & Addiction Recovery",
  description:
    "Ezz Freedom and Hope offers professional support for drug addiction recovery, mental health, couples therapy, anger management, teenage sessions, and addiction therapy.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://ezzfreedomandhope.or.ke",
    languages: {
      "en-US": "https://ezzfreedomandhope.or.ke/en-US",
    },
  },
  category: "health",
  twitter: {
    card: "ezz freedom and hope logo",
    title: "Ezz Freedom and Hope - Mental Health & Addiction Recovery",
    description:
      "Expert support for drug addiction recovery, mental health, couples therapy, and more.",
    creator: "@ezzfreedomandhope",
    images: ["https://ezzfreedomandhope.or.ke/assets/logo.png"],
  },
  facebook: {
    appId: "YOUR_FACEBOOK_APP_ID", // Replace with actual ID if available
  },
  appLinks: {
    web: {
      url: "https://ezzfreedomandhope.or.ke",
      should_fallback: true,
    },
  },

  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    bing: "YOUR_BING_VERIFICATION_CODE",
  },

  other: {
    "theme-color": "#31B44D",
    robots: "index, follow",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
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
