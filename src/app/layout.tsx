import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { rajdhani, manrope } from "@/utils/font";
import { Wallet } from "@/walletAdapter/walletAdapterLib";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers/reduxProvider";

export const metadata: Metadata = {
  title: "Emerg Funds Raising",
  description:
    "Emerg Funds Raising - A platform to support emergency fundraisers.",
  keywords: [
    "fundraising",
    "emergency funds",
    "donations",
    "charity",
    "support",
    "crowdfunding",
  ],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://emergfundraising.com",
  },
  openGraph: {
    title: "Emerg Funds Raising",
    description: "A platform to support emergency fundraisers",
    url: "https://emergfundraising.com",
    siteName: "Emerg Funds Raising",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emerg Fund Raising Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emerg Funds Raising",
    description: "A platform to support emergency fundraisers",
    images: ["/twitter-image.png"],
    creator: "@emergfunds",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempo.new/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={`${rajdhani.variable} ${manrope.variable}`}>
        <Providers>
          <Wallet>{children}</Wallet>
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
