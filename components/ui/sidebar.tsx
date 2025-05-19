'use client';
// Sidebar primitives based on shadcn/ui (https://ui.shadcn.com/docs/components/sidebar)
import * as React from "react";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function SidebarProvider({ children, defaultOpen = true }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar-open");
      return stored === null ? defaultOpen : stored === "true";
    }
    return defaultOpen;
  });
  React.useEffect(() => {
    localStorage.setItem("sidebar-open", String(open));
  }, [open]);
  return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
}

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { collapsible?: boolean }>(
  ({ className, children, collapsible = true, ...props }, ref) => {
    const { open } = useSidebar();
    return (
      <aside
        ref={ref}
        className={cn(
          "relative flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsible ? (open ? "w-64" : "w-16") : "w-64",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = "Sidebar";

export function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>;
}

export function SidebarHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("sticky top-0 z-10 bg-sidebar px-4 py-3 font-bold text-lg border-b border-sidebar-border", className)}>{children}</div>;
}

export function SidebarFooter({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("sticky bottom-0 z-10 bg-sidebar px-4 py-3 border-t border-sidebar-border", className)}>{children}</div>;
}

export function SidebarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function SidebarGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-4 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider", className)}>{children}</div>;
}

export function SidebarGroupContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
}

export function SidebarMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn("flex flex-col gap-1", className)}>{children}</ul>;
}

export function SidebarMenuItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <li className={cn("", className)}>{children}</li>;
}

export function SidebarMenuButton({ children, asChild = false, className, ...props }: { children: React.ReactNode; asChild?: boolean; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (asChild) return children;
  return (
    <button className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-base w-full", className)} {...props}>
      {children}
    </button>
  );
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useSidebar();
  return (
    <button
      type="button"
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      onClick={() => setOpen(!open)}
      className={cn(
        "absolute -right-3 top-4 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-sidebar border border-sidebar-border shadow transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-sidebar-ring",
        className
      )}
      {...props}
    >
      <span aria-hidden>{open ? "←" : "→"}</span>
    </button>
  );
} 