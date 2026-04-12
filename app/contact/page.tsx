import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Alpha Rig — custom build inquiries, event partnerships, store questions, or just talk hardware. Based in Chhindwara, Madhya Pradesh, India.",
  keywords: ["contact Alpha Rig", "custom PC inquiry India", "PC build inquiry Madhya Pradesh"],
  openGraph: {
    title: "Contact Alpha Rig",
    description: "Builds, events, collabs — reach the Alpha Rig team directly.",
    url: "https://alpharig.in/contact",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Contact Alpha Rig" },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return <ContactContent />;
}
