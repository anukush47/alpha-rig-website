import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Alpha Rig Private Limited — Founded in Durg, Chhattisgarh in 2022 by Anupam Kushwaha. Building India's premier custom PC culture from the ground up.",
  keywords: ["Alpha Rig story", "custom PC India founder", "PC culture Chhattisgarh", "Anupam Kushwaha Alpha Rig"],
  openGraph: {
    title: "About Alpha Rig | Our Story",
    description: "Founded in Durg, Chhattisgarh. Building India's custom PC culture from scratch.",
    url: "https://alpharig.in/about",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "About Alpha Rig | Our Story" },
};

export default function AboutPage() {
  return <AboutContent />;
}
