"use client";
import { Button } from "../ui/button";

interface TestNavigationProps {
  total: number;
  current: number;
  onNavigate: (idx: number) => void;
  navColors: ("outline" | "orange" | "green" | "red")[];
}

export default function TestNavigation({ total, current, onNavigate, navColors }: TestNavigationProps) {
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
        return (
          <Button
            key={i}
            variant="outline"
            className={`${base} ${bg} ${i === current ? '!ring-2 !ring-primary' : ''}`}
            onClick={() => onNavigate(i)}
            aria-label={`Go to question ${i + 1}`}
            tabIndex={0}
          >
            {i + 1}
          </Button>
        );
      })}
    </div>
  );
} 