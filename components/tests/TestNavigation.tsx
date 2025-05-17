"use client";
import { Button } from "../ui/button";
import { Lock } from "lucide-react";

interface TestNavigationProps {
  total: number;
  current: number;
  onNavigate: (idx: number) => void;
  navColors: ("outline" | "orange" | "green" | "red")[];
  isPremium: boolean;
}

export default function TestNavigation({ total, current, onNavigate, navColors, isPremium }: TestNavigationProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {Array.from({ length: total }).map((_, i) => {
        let color = navColors[i] || "outline";
        let base = "w-8 h-8 p-0 rounded-full flex items-center justify-center font-semibold transition-colors bg-none border-none !bg-none !border-none focus:!ring-2 focus:!ring-primary";
        let bg = "!bg-transparent !text-foreground !border !border-gray-600";
        if (color === "green") bg = "!bg-green-900 !text-white !border !border-green-600";
        else if (color === "red") bg = "!bg-red-900 !text-white !border !border-red-600";
        else if (color === "orange") bg = "!bg-orange-900 !text-white !border !border-orange-600";
        else if (i === current) bg = "!bg-gray-900 !text-white !border !border-gray-600";
        const locked = !isPremium && i >= 5;
        return (
          <Button
            key={i}
            variant="outline"
            className={`${base} ${bg} ${locked ? '!bg-white !text-gray-600 !border !border-gray-300' : ''} ${i === current ? '!ring-2 !ring-primary' : ''}`}
            onClick={() => onNavigate(i)}
            disabled={locked}
            aria-label={locked ? "Locked. Upgrade to access." : `Go to question ${i + 1}`}
            tabIndex={0}
          >
            {locked ? <Lock className="w-4 h-4 mx-auto text-gray-400" /> : i + 1}
          </Button>
        );
      })}
    </div>
  );
} 