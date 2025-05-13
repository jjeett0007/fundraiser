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
      { url: "/logo.jpg", type: "image/x-icon" },
      { url: "/logo.jpg", type: "image/jpg", sizes: "16x16" },
      { url: "/logo.jpg", type: "image/jpg", sizes: "32x32" },
      { url: "/logo.jpg", type: "image/jpg", sizes: "96x96" },
    ],
    shortcut: "/logo-16x16.png",
    apple: [
      { url: "/logo.jpg", sizes: "180x180" },
      { url: "/logo.jpg", sizes: "152x152" },
      { url: "/logo.jpg", sizes: "167x167" },
    ],
  },
  verification: {
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://www.emergfunds.org",
  },
  openGraph: {
    title: "Emerg Funds Raising",
    description:
      "Emerg Funds Raising is a dedicated platform designed to help individuals and organizations quickly raise emergency funds for urgent needs. Easily create, share, and support fundraising campaigns for medical emergencies, disaster relief, and other critical situations.",
    url: "https://www.emergfunds.org",
    siteName: "Emergency Funds Raising",
    images: [
      {
        url: "/twitter-banner.jpeg",
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
    description:
      "Emerg Funds Raising is a dedicated platform designed to help individuals and organizations quickly raise emergency funds for urgent needs. Easily create, share, and support fundraising campaigns for medical emergencies, disaster relief, and other critical situations.",
    images: ["/twitter-banner.jpeg"],
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
