'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, CreditCard, LogOut, BookOpen } from "lucide-react";
import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "./ui/sidebar";
import { cn } from "../src/lib/utils";
import { supabaseBrowserClient } from "../lib/supabaseBrowserClient";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = supabaseBrowserClient;

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then((result: { data: { user: any } }) => setUser(result?.data?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: any } | null) => {
        setUser(session?.user || null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <ShadSidebar collapsible className="min-h-screen py-4 px-2">
      <SidebarHeader className="flex items-center justify-between px-2">
        <span className={cn("font-bold text-lg tracking-tight transition-all", !open && "opacity-0 w-0 overflow-hidden")}>{process.env.NEXT_PUBLIC_SITENAME}</span>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {/* Dashboard */}
          <SidebarMenuItem key="/dashboard">
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-base",
                  pathname.startsWith("/dashboard")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-muted-foreground"
                )}
                aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
              >
                <Home className="w-5 h-5 shrink-0" aria-hidden />
                <span className={cn("transition-all duration-200", !open && "opacity-0 w-0 overflow-hidden")}>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Practice Tests Dropdown or Inline Submenu */}
          <SidebarMenuItem>
            {open ? (
              <div className="w-full">
                <SidebarMenuButton className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-base w-full", pathname.startsWith("/dashboard") ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground")}
                  aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
                  asChild={false}
                  type="button"
                  tabIndex={-1}
                  style={{ cursor: "default" }}
                  disabled
                >
                  <BookOpen className="w-5 h-5 shrink-0" aria-hidden />
                  <span className={cn("transition-all duration-200")}>Practice Tests</span>
                </SidebarMenuButton>
                <div className="pl-8 flex flex-col gap-1 mt-1">
                  <Link href="/guided" className={cn("px-2 py-1 rounded text-base transition-colors", pathname.startsWith("/guided") ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground")}>Guided Tests</Link>
                  <Link href="/sequential" className={cn("px-2 py-1 rounded text-base transition-colors", pathname.startsWith("/sequential") ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground")}>Sequential Tests</Link>
                  <Link href="/random" className={cn("px-2 py-1 rounded text-base transition-colors", pathname.startsWith("/random") ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground")}>Random Tests</Link>
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-base w-full", pathname.startsWith("/dashboard") ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground")}
                    aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
                  >
                    <BookOpen className="w-5 h-5 shrink-0" aria-hidden />
                    <span className={cn("transition-all duration-200", !open && "opacity-0 w-0 overflow-hidden")}>Practice Tests</span>
                    <svg className={cn("ml-auto transition-transform", !open && "hidden")} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="ml-2">
                  <DropdownMenuItem asChild>
                    <Link href="/guided">Guided Tests</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sequential">Sequential Tests</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/random">Random Tests</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
          {/* Profile & Subscription */}
          <SidebarMenuItem key="/profile">
            <SidebarMenuButton asChild>
              <Link
                href="/profile"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-base",
                  pathname.startsWith("/profile")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-muted-foreground"
                )}
                aria-current={pathname.startsWith("/profile") ? "page" : undefined}
              >
                <User className="w-5 h-5 shrink-0" aria-hidden />
                <span className={cn("transition-all duration-200", !open && "opacity-0 w-0 overflow-hidden")}>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem key="/subscription">
            <SidebarMenuButton asChild>
              <Link
                href="/subscription"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-base",
                  pathname.startsWith("/subscription")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-muted-foreground"
                )}
                aria-current={pathname.startsWith("/subscription") ? "page" : undefined}
              >
                <CreditCard className="w-5 h-5 shrink-0" aria-hidden />
                <span className={cn("transition-all duration-200", !open && "opacity-0 w-0 overflow-hidden")}>Subscription</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      {user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-base text-destructive hover:bg-destructive/10 w-full"
                )}
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 shrink-0" aria-hidden />
                <span className={cn("transition-all duration-200", !open && "opacity-0 w-0 overflow-hidden")}>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </ShadSidebar>
  );
} 