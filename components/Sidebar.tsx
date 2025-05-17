import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, User, CreditCard } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Sidebar navigation"
      className="h-full w-64 bg-card border-r border-border flex flex-col py-8 px-4 gap-2 min-h-screen"
    >
      <div className="mb-8 text-lg font-bold tracking-tight px-2">CitizenPrep</div>
      <ul className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={href}>
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
              <Icon className="w-5 h-5" aria-hidden />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
} 