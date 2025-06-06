import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { rajdhani, manrope } from "@/utils/font";
import { Wallet } from "@/walletAdapter/walletAdapterLib";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers/reduxProvider";
import OfflineDetector from "@/components/useables/OfflineDetector";

export const metadata: Metadata = {
  title: "Emerg Funds Raising",
  description:
    "Emerg Funds Raising is a dedicated platform designed to help individuals and organizations quickly raise emergency funds for urgent needs. Easily create, share, and support fundraising campaigns for medical emergencies, disaster relief, and other critical situations.",
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
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["https://www.emergfunds.org/logo.jpg"],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "https://www.emergfunds.org/logo.jpg",
      },
    ],
  },
  verification: {
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://www.emergfunds.org",
  },
  metadataBase: new URL("https://www.emergfunds.org"),
  openGraph: {
    title: "Emerg Funds Raising",
    description:
      "Emerg Funds Raising is a dedicated platform designed to help individuals and organizations quickly raise emergency funds for urgent needs. Easily create, share, and support fundraising campaigns for medical emergencies, disaster relief, and other critical situations.",
    siteName: "Emergency Funds Raising",
    images: [
      {
        url: "https://www.emergfunds.org/twitter-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Emerg Fund Raising Platform",
      },
      {
        url: "https://www.emergfunds.org/logo.jpg",
        width: 800,
        height: 600,
        alt: "Emerg Fund Raising Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emerg Funds Raising",
    description:
      "Emerg Funds Raising is a dedicated platform designed to help individuals and organizations quickly raise emergency funds for urgent needs. Easily create, share, and support fundraising campaigns for medical emergencies, disaster relief, and other critical situations.",
    images: ["https://www.emergfunds.org/twitter-banner.jpeg"],
    creator: "@emergfunds_",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <Script src="https://api.tempo.new/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={`${rajdhani.variable} ${manrope.variable}`}>
        <Providers>
          <OfflineDetector />
          <Wallet>{children}</Wallet>
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
