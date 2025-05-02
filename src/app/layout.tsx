import { TempoInit } from "./tempo-init";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { baloo_init } from "@/utils/font";
import { Wallet } from "@/walletAdapter/walletAdapterLib";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Emerg Fund Raising",
  description:
    "Emerg Fund Raising - A platform to support emergency fundraisers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempo.new/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={baloo_init.className}>
        <Wallet>{children}</Wallet>
        <Analytics />
        <TempoInit />
      </body>
    </html>
  );
}
