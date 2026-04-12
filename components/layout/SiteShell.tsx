"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) return <>{children}</>;

  return (
    <>
      <Navbar />
      <div className="flex flex-col flex-1">{children}</div>
      <Footer />
    </>
  );
}
