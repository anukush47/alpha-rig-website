import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AccountSidebar from "@/components/layout/AccountSidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100dvh",
        paddingTop: "80px",        /* clear the fixed navbar */
        background: "var(--color-void)",
      }}
    >
      {/* Sidebar — desktop only */}
      <div className="hidden md:block">
        <AccountSidebar />
      </div>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "clamp(24px, 4vw, 48px) clamp(20px, 4vw, 40px)",
          overflowX: "hidden",
          minWidth: 0,
          maxWidth: "960px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
