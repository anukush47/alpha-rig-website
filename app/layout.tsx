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
  metadataBase: new URL("https://alpharig.in"),
  title: {
    default: "Alpha Rig | Custom PCs · Esports Events · PC Culture India",
    template: "%s | Alpha Rig",
  },
  description:
    "Alpha Rig Private Limited — Custom-built gaming PCs, professional esports events, PC hardware blog, and online store. Based in Chhindwara, Madhya Pradesh, India.",
  keywords: [
    "custom gaming PC India",
    "custom built PC Madhya Pradesh",
    "esports events India",
    "PC components online",
    "gaming PC builder India",
    "Alpha Rig",
    "custom PC Chhindwara",
    "gaming PC Madhya Pradesh",
  ],
  authors: [{ name: "Alpha Rig Private Limited" }],
  creator: "Alpha Rig Private Limited",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://alpharig.in",
    siteName: "Alpha Rig",
    title: "Alpha Rig | Custom PCs · Esports Events · PC Culture India",
    description:
      "Alpha Rig Private Limited — Custom-built gaming PCs, professional esports events, PC hardware blog, and online store. Based in Chhindwara, Madhya Pradesh, India.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Alpha Rig" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Rig | Custom PCs · Esports Events · PC Culture India",
    description:
      "Alpha Rig Private Limited — Custom-built gaming PCs, professional esports events, and PC hardware. Based in Chhindwara, Madhya Pradesh, India.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large" },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Alpha Rig Private Limited",
              url: "https://alpharig.in",
              logo: "https://alpharig.in/logo.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Chhindwara",
                addressRegion: "Madhya Pradesh",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-8225986582",
                contactType: "customer service",
              },
              sameAs: [
                "https://instagram.com/alpharig",
                "https://twitter.com/alpharig",
                "https://youtube.com/@alpharig",
                "https://linkedin.com/company/alpharig",
              ],
            }),
          }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
