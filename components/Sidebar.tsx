'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, CreditCard, LogOut } from "lucide-react";
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
        <span className={cn("font-bold text-lg tracking-tight transition-all", !open && "opacity-0 w-0 overflow-hidden")}>CitizenPrep</span>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton asChild>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-base",
                    pathname.startsWith(href)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                  aria-current={pathname.startsWith(href) ? "page" : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" aria-hidden />
                  <span
                    className={cn(
                      "transition-all duration-200",
                      !open && "opacity-0 w-0 overflow-hidden"
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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