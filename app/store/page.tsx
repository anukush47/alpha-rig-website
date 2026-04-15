import type { Metadata } from "next";
import ComingSoon from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Store — Coming Soon | Alpha Rig",
  description:
    "The Alpha Rig store is coming soon. Hand-picked GPUs, CPUs, cooling, peripherals, and Alpha Rig Originals — launching shortly.",
};

export default function StorePage() {
  return (
    <ComingSoon
      tag="STORE"
      heading="COMING"
      subheading="SOON"
      description="We're hand-picking the finest hardware for your next build. Sign up and be the first to shop when we go live."
      features={[
        "GPUs",
        "CPUs",
        "Motherboards",
        "RAM & Storage",
        "CPU Cooling",
        "Cases",
        "Peripherals",
        "Alpha Rig Originals",
      ]}
    />
  );
}
