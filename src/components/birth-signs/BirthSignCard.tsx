import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BirthSignCardProps {
  sign: string;
  position: string;
  icon: LucideIcon;
  iconColor: string;
  degrees: number;
  minutes: number;
  isOpen: boolean;
  description: string;
  onClick: () => void;
}

export function BirthSignCard({
  sign,
  position,
  icon: Icon,
  iconColor,
  degrees,
  minutes,
  isOpen,
  description,
  onClick
}: BirthSignCardProps) {
  return (
    <div className="group">
      <div 
        className="flex items-center gap-4 p-6 rounded-lg bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
        onClick={onClick}
      >
        <div className={cn("p-3 rounded-full", `bg-${iconColor}/10`)}>
          <Icon className={cn("w-6 h-6", `text-${iconColor}`)} />
        </div>
        <div className="flex-1">
          <div className="font-serif text-xl">{sign}</div>
          <div className="text-sm text-primary/60 font-mono">
            {`${Math.floor(degrees)}°${String(Math.floor(minutes)).padStart(2, "0")}′`}
          </div>
        </div>
        <div className={cn(
          "w-5 h-5 text-accent-orange/70 transition-transform duration-200",
          isOpen && "rotate-90"
        )}>
          →
        </div>
      </div>
      {isOpen && (
        <div className={cn("mt-2 p-4 rounded-lg text-primary-dark/80 animate-fade-up", `bg-${iconColor}/5`)}>
          {description}
        </div>
      )}
    </div>
  );
}