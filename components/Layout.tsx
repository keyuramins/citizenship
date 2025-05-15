import { ReactNode } from "react";
import NextTopLoader from "nextjs-toploader";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NextTopLoader color="#2563eb" showSpinner={false} />
      <header className="p-4 border-b flex items-center justify-between">
        <span className="font-bold text-lg">Citizenship Practice</span>
        <ThemeSwitcher />
        {/* TODO: Add navigation links and global stats */}
      </header>
      <main className="flex-1 container mx-auto p-4">{children}</main>
      <footer className="p-4 border-t text-center text-xs text-gray-500">&copy; {new Date().getFullYear()} Citizenship Practice</footer>
    </div>
  );
} 