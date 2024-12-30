import React from "react";
import { BirthChartResult } from "@/utils/astro-utils";

interface ChartResultsProps {
  mainWestern: BirthChartResult | null;
  mainVedic: BirthChartResult | null;
}

export function ChartResults({ mainWestern, mainVedic }: ChartResultsProps) {
  if (!mainWestern || !mainVedic) return null;

  console.log("ChartResults received Western:", mainWestern);
  console.log("ChartResults received Vedic:", mainVedic);

  const formatPosition = (sign: string, deg: number, min: number) => {
    console.log(`Formatting position for ${sign}:`, { deg, min });
    return `${sign} ${Math.floor(deg)}°${String(Math.floor(min)).padStart(2, "0")}′`;
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-2xl font-serif mb-6">
            Western (Tropical) Chart
          </h3>
          <div className="space-y-4 font-mono">
            <p className="flex items-baseline">
              <span className="w-20 font-medium">Sun:</span>
              <span>{formatPosition(mainWestern.sunSign, mainWestern.sunDeg, mainWestern.sunMin)}</span>
            </p>
            <p className="flex items-baseline">
              <span className="w-20 font-medium">Moon:</span>
              <span>{formatPosition(mainWestern.moonSign, mainWestern.moonDeg, mainWestern.moonMin)}</span>
            </p>
            <p className="flex items-baseline">
              <span className="w-20 font-medium">Rising:</span>
              <span>{formatPosition(mainWestern.risingSign, mainWestern.risingDeg, mainWestern.risingMin)}</span>
            </p>
          </div>
        </div>

        <div className="p-6 border rounded-lg shadow-sm opacity-50">
          <h3 className="text-2xl font-serif mb-6">
            Vedic (Sidereal) Chart - Coming Soon
          </h3>
          <div className="space-y-4 font-mono">
            <p className="flex items-baseline">
              <span className="w-20 font-medium">Sun:</span>
              <span>{formatPosition(mainVedic.sunSign, mainVedic.sunDeg, mainVedic.sunMin)}</span>
            </p>
            <p className="flex items-baseline">
              <span className="w-20 font-medium">Moon:</span>
              <span>{formatPosition(mainVedic.moonSign, mainVedic.moonDeg, mainVedic.moonMin)}</span>
            </p>
            <p className="flex items-baseline">
              <span className="w-20 font-medium">Rising:</span>
              <span>{formatPosition(mainVedic.risingSign, mainVedic.risingDeg, mainVedic.risingMin)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}