import React from "react";
import { BirthChartResult } from "@/utils/astro-utils";

interface ChartResultsProps {
  mainWestern: BirthChartResult | null;
  mainVedic: BirthChartResult | null;
}

export function ChartResults({ mainWestern }: ChartResultsProps) {
  if (!mainWestern) return null;

  console.log("ChartResults received Western:", mainWestern);

  const formatPosition = (sign: string, deg: number, min: number) => {
    console.log(`Formatting position for ${sign}:`, { deg, min });
    return `${sign} ${Math.floor(deg)}°${String(Math.floor(min)).padStart(2, "0")}′`;
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-2xl font-serif mb-6">
            Western (Tropical) Chart
          </h3>
          <div className="space-y-4 font-mono">
            <p className="flex items-baseline">
              <span className="w-20 font-medium">Sun:</span>
              <span>{formatPosition(mainWestern.sun.sign, mainWestern.sun.degrees, mainWestern.sun.minutes)}</span>
            </p>
            <p className="flex items-baseline">
              <span className="w-20 font-medium">Moon:</span>
              <span>{formatPosition(mainWestern.moon.sign, mainWestern.moon.degrees, mainWestern.moon.minutes)}</span>
            </p>
            <p className="flex items-baseline">
              <span className="w-20 font-medium">Rising:</span>
              <span>{formatPosition(mainWestern.rising.sign, mainWestern.rising.degrees, mainWestern.rising.minutes)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}