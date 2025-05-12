"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const themes = [
  { label: "Light", value: "light", icon: <Sun className="w-4 h-4" /> },
  { label: "Dark", value: "dark", icon: <Moon className="w-4 h-4" /> },
  { label: "System", value: "system", icon: <Laptop className="w-4 h-4" /> },
];

export default function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current =
    themes.find((t) => t.value === theme) ||
    themes.find((t) => t.value === resolvedTheme) ||
    themes[2];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Toggle theme"
          className="border border-border"
        >
          {current.icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-1">
        <div className="flex flex-col gap-1">
          {themes.map((t) => (
            <button
              key={t.value}
              className={`flex items-center gap-2 w-full px-2 py-2 rounded text-sm transition-colors text-left ${
                (theme === t.value || (t.value === "system" && theme === undefined))
                  ? "bg-accent text-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`}
              onClick={() => setTheme(t.value)}
              aria-pressed={theme === t.value}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
} 