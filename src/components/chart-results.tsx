import React from "react";
import { BirthChartResult } from "@/utils/astro-utils";
import { Sun, Moon, Sunrise } from "lucide-react";

interface ChartResultsProps {
  mainWestern: BirthChartResult | null;
  mainVedic: BirthChartResult | null;
  interpretation?: string;
}

export function ChartResults({ mainWestern, interpretation }: ChartResultsProps) {
  if (!mainWestern) return null;

  console.log("ChartResults received Western:", mainWestern);

  const formatPosition = (sign: string, deg: number, min: number) => {
    return `${Math.floor(deg)}°${String(Math.floor(min)).padStart(2, "0")}′`;
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="grid grid-cols-1 gap-6">
        <div className="p-8 border rounded-lg shadow-sm bg-background-sand/30">
          <h3 className="text-2xl font-serif mb-8 text-center">
            Your Birth Signs
          </h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50 transition-all hover:bg-white/80">
              <div className="p-3 rounded-full bg-accent-orange/10">
                <Sun className="w-6 h-6 text-accent-orange" />
              </div>
              <div>
                <div className="font-serif text-lg">{mainWestern.sunSign}</div>
                <div className="text-sm text-primary/60 font-mono">
                  {formatPosition(mainWestern.sunSign, mainWestern.sunDeg, mainWestern.sunMin)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50 transition-all hover:bg-white/80">
              <div className="p-3 rounded-full bg-accent-lightpalm/10">
                <Moon className="w-6 h-6 text-accent-lightpalm" />
              </div>
              <div>
                <div className="font-serif text-lg">{mainWestern.moonSign}</div>
                <div className="text-sm text-primary/60 font-mono">
                  {formatPosition(mainWestern.moonSign, mainWestern.moonDeg, mainWestern.moonMin)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50 transition-all hover:bg-white/80">
              <div className="p-3 rounded-full bg-accent-palm/10">
                <Sunrise className="w-6 h-6 text-accent-palm" />
              </div>
              <div>
                <div className="font-serif text-lg">{mainWestern.risingSign}</div>
                <div className="text-sm text-primary/60 font-mono">
                  {formatPosition(mainWestern.risingSign, mainWestern.risingDeg, mainWestern.risingMin)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {interpretation && (
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-2xl font-serif mb-6">
              Astrological Interpretation
            </h3>
            <div className="prose prose-slate max-w-none">
              {interpretation.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}