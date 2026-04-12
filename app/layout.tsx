import type { Metadata } from "next";
import { Bebas_Neue, Rajdhani, Space_Mono } from "next/font/google";
import SiteShell from "@/components/layout/SiteShell";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  weight: ["400", "600", "700"],
  variable: "--font-rajdhani",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alpha Rig | Custom PC Builds",
  description:
    "Alpha Rig Private Limited — Precision-engineered custom PC builds, events, and hardware for enthusiasts who demand the extraordinary.",
  keywords: ["custom PC", "gaming PC", "PC builds", "Alpha Rig", "custom builds India"],
  openGraph: {
    title: "Alpha Rig | Custom PC Builds",
    description: "Precision-engineered custom PC builds for enthusiasts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${rajdhani.variable} ${spaceMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
