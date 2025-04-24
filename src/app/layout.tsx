import { TempoInit } from "./tempo-init";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import HeaderComp from "@/components/useables/header";
import FooterComp from "@/components/useables/footer";
import { baloo_init } from "@/utils/font";

export const metadata: Metadata = {
  title: "Tempo - Modern SaaS Starter",
  description: "A modern full-stack starter template powered by Next.js",
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
        <HeaderComp />
        {children}
        <FooterComp />
        <TempoInit />
      </body>
    </html>
  );
}
