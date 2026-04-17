"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "@/components/ui/CartDrawer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");
  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

  if (isStudio || isAuthPage) return <>{children}</>;

  return (
    <>
      <Navbar />
      <CartDrawer />
      <div className="flex flex-col flex-1">{children}</div>
      <Footer />
    </>
  );
}
