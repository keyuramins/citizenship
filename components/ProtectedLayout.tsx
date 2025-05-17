"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const protectedRoutes = [
  "/dashboard",
  "/tests",
  "/profile",
  "/subscription",
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!isProtected) return <>{children}</>;
  return (
    <div className="relative h-[100dvh] min-h-0 w-full flex">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-30 h-[100dvh] w-64">
        <Sidebar />
      </aside>
      {/* Main Content (scrollable) */}
      <div
        className="flex-1 ml-64 min-w-0 h-[100dvh] overflow-y-auto bg-background flex flex-col"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
    </div>
  );
} 