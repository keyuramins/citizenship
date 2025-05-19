"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { SidebarProvider, useSidebar } from "./ui/sidebar";
import React from "react";
import Header from "./Header";

const protectedRoutes = [
  "/dashboard",
  "/tests",
  "/profile",
  "/subscription",
];

function ProtectedLayoutInner({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();
  const pathname = usePathname();
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!isProtected) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="sticky top-0 z-20 w-full">
          <Header />
        </div>
        <main className="flex-1 flex flex-col" aria-label="Main content">
          {children}
        </main>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen w-full flex">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-30 h-screen">
        <Sidebar />
      </aside>
      {/* Main Content (scrollable) */}
      <div
        className={
          `flex-1 min-w-0 bg-background flex flex-col transition-all duration-300 ` +
          (open ? "ml-64" : "ml-16")
        }
      >
        {/* Fixed Header */}
        <div className="sticky top-0 z-20 w-full">
          <Header />
        </div>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ProtectedLayoutInner>{children}</ProtectedLayoutInner>
    </SidebarProvider>
  );
} 