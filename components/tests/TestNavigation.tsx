"use client";
import { Button } from "../ui/button";
import { Lock } from "lucide-react";

interface TestNavigationProps {
  total: number;
  current: number;
  onNavigate: (idx: number) => void;
  answers: (string | undefined)[];
  review: boolean[];
  getNavColor: (idx: number) => string;
  isPremium: boolean;
}

export default function TestNavigation({ total, current, onNavigate, answers, review, getNavColor, isPremium }: TestNavigationProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {Array.from({ length: total }).map((_, i) => {
        let color = getNavColor(i);
        let variant: "default" | "secondary" | "outline" = "outline";
        let extra = "";
        if (color === "green") variant = "default";
        else if (color === "red") { variant = "secondary"; extra = "border-red-400 text-red-600"; }
        else if (color === "orange") { variant = "secondary"; extra = "border-orange-400 text-orange-600"; }
        else if (i === current) variant = "default";
        const locked = !isPremium && i >= 5;
        return (
          <Button
            key={i}
            variant={variant}
            className={`w-8 h-8 p-0 rounded-full ${extra} ${i === current ? "ring-2 ring-primary" : ""}`}
            onClick={() => onNavigate(i)}
            disabled={locked}
            aria-label={locked ? "Locked. Upgrade to access." : `Go to question ${i + 1}`}
          >
            {locked ? <Lock className="w-4 h-4 mx-auto" /> : i + 1}
          </Button>
        );
      })}
    </div>
  );
} 