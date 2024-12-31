import React, { useState } from "react";
import { BirthChartResult } from "@/utils/astro-utils";
import { Sun, Moon, Sunrise, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ChartResultsProps {
  mainWestern: BirthChartResult | null;
  mainVedic: BirthChartResult | null;
  interpretation?: string;
}

export function ChartResults({ mainWestern, interpretation }: ChartResultsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showInterpretation, setShowInterpretation] = useState(false);

  if (!mainWestern) return null;

  console.log("ChartResults received Western:", mainWestern);

  const formatPosition = (sign: string, deg: number, min: number) => {
    return `${Math.floor(deg)}°${String(Math.floor(min)).padStart(2, "0")}′`;
  };

  const descriptions = {
    sun: "Your Sun sign represents your core identity and basic personality—the essence of who you are. It influences how you express yourself and your fundamental approach to life.",
    moon: "Your Moon sign reflects your emotional nature, instincts, and subconscious patterns. It reveals how you process feelings and what makes you feel secure and comfortable.",
    rising: "Your Rising sign (or Ascendant) is the mask you wear when meeting others. It influences your appearance and how you approach new situations and environments."
  };

  return (
    <div className="w-screen">
      <h2 className="text-4xl font-serif font-bold text-center text-primary-dark pt-4 pb-8">
        Your Birth Signs
      </h2>
      
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* Sun Sign */}
        <div className="group">
          <div 
            className="flex items-center gap-4 p-6 rounded-lg bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
            onClick={() => setOpenSection(openSection === 'sun' ? null : 'sun')}
          >
            <div className="p-3 rounded-full bg-accent-orange/10">
              <Sun className="w-6 h-6 text-accent-orange" />
            </div>
            <div className="flex-1">
              <div className="font-serif text-xl">{mainWestern.sunSign}</div>
              <div className="text-sm text-primary/60 font-mono">
                {formatPosition(mainWestern.sunSign, mainWestern.sunDeg, mainWestern.sunMin)}
              </div>
            </div>
            <ChevronRight className={cn(
              "w-5 h-5 text-accent-orange/70 transition-transform duration-200",
              openSection === 'sun' && "rotate-90"
            )} />
          </div>
          {openSection === 'sun' && (
            <div className="mt-2 p-4 rounded-lg bg-accent-orange/5 text-primary-dark/80 animate-fade-up">
              {descriptions.sun}
            </div>
          )}
        </div>

        {/* Moon Sign */}
        <div className="group">
          <div 
            className="flex items-center gap-4 p-6 rounded-lg bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
            onClick={() => setOpenSection(openSection === 'moon' ? null : 'moon')}
          >
            <div className="p-3 rounded-full bg-accent-lightpalm/10">
              <Moon className="w-6 h-6 text-accent-lightpalm" />
            </div>
            <div className="flex-1">
              <div className="font-serif text-xl">{mainWestern.moonSign}</div>
              <div className="text-sm text-primary/60 font-mono">
                {formatPosition(mainWestern.moonSign, mainWestern.moonDeg, mainWestern.moonMin)}
              </div>
            </div>
            <ChevronRight className={cn(
              "w-5 h-5 text-accent-lightpalm/70 transition-transform duration-200",
              openSection === 'moon' && "rotate-90"
            )} />
          </div>
          {openSection === 'moon' && (
            <div className="mt-2 p-4 rounded-lg bg-accent-lightpalm/5 text-primary-dark/80 animate-fade-up">
              {descriptions.moon}
            </div>
          )}
        </div>

        {/* Rising Sign */}
        <div className="group">
          <div 
            className="flex items-center gap-4 p-6 rounded-lg bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
            onClick={() => setOpenSection(openSection === 'rising' ? null : 'rising')}
          >
            <div className="p-3 rounded-full bg-accent-palm/10">
              <Sunrise className="w-6 h-6 text-accent-palm" />
            </div>
            <div className="flex-1">
              <div className="font-serif text-xl">{mainWestern.risingSign}</div>
              <div className="text-sm text-primary/60 font-mono">
                {formatPosition(mainWestern.risingSign, mainWestern.risingDeg, mainWestern.risingMin)}
              </div>
            </div>
            <ChevronRight className={cn(
              "w-5 h-5 text-accent-palm/70 transition-transform duration-200",
              openSection === 'rising' && "rotate-90"
            )} />
          </div>
          {openSection === 'rising' && (
            <div className="mt-2 p-4 rounded-lg bg-accent-palm/5 text-primary-dark/80 animate-fade-up">
              {descriptions.rising}
            </div>
          )}
        </div>

        {/* AI Interpretation Button */}
        <div className="pt-12 text-center">
          <Button
            variant="ghost"
            className="text-accent-orange hover:text-accent-orange/90 hover:bg-accent-orange/10 text-lg font-mono group relative"
            onClick={() => setShowInterpretation(!showInterpretation)}
          >
            <span className="relative z-10">Get Your Personal Reading</span>
            <div className="absolute inset-0 bg-gradient-to-t from-accent-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          </Button>
        </div>

        {/* AI Interpretation Section */}
        {showInterpretation && interpretation && (
          <div className="mt-8 p-8 rounded-lg bg-white shadow-lg animate-fade-up">
            <h3 className="text-2xl font-serif font-bold mb-6 text-primary-dark">
              Your Personal Reading
            </h3>
            <div className="prose prose-slate max-w-none space-y-4">
              {interpretation.split('\n').map((paragraph, index) => (
                <p key={index} className="text-primary-dark/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}