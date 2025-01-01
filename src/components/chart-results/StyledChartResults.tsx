import React from "react";
import { BirthChartResult } from "@/utils/astro-utils";
import { Sun, Moon, Sunrise, Loader2 } from "lucide-react";
import { BirthSignCard } from "../birth-signs/BirthSignCard";
import { InterpretationSection } from "../interpretation/InterpretationSection";

interface StyledChartResultsProps {
  mainWestern: BirthChartResult;
  openSection: string | null;
  setOpenSection: (section: string | null) => void;
  isLoading: boolean;
  currentInterpretation: string | null;
  descriptions: {
    sun: string;
    moon: string;
    rising: string;
  };
}

export function StyledChartResults({
  mainWestern,
  openSection,
  setOpenSection,
  isLoading,
  currentInterpretation,
  descriptions,
}: StyledChartResultsProps) {
  return (
    <div className="w-screen">
      <h2 className="text-4xl font-serif font-bold text-center text-primary-dark pt-4 pb-8">
        Your Birth Signs
      </h2>
      
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        <BirthSignCard
          sign={mainWestern.sunSign}
          position={`${mainWestern.sunDeg}°${mainWestern.sunMin}'`}
          icon={Sun}
          iconColor="accent-orange"
          degrees={mainWestern.sunDeg}
          minutes={mainWestern.sunMin}
          isOpen={openSection === 'sun'}
          description={descriptions.sun}
          onClick={() => setOpenSection(openSection === 'sun' ? null : 'sun')}
        />

        <BirthSignCard
          sign={mainWestern.moonSign}
          position={`${mainWestern.moonDeg}°${mainWestern.moonMin}'`}
          icon={Moon}
          iconColor="accent-lightpalm"
          degrees={mainWestern.moonDeg}
          minutes={mainWestern.moonMin}
          isOpen={openSection === 'moon'}
          description={descriptions.moon}
          onClick={() => setOpenSection(openSection === 'moon' ? null : 'moon')}
        />

        <BirthSignCard
          sign={mainWestern.risingSign}
          position={`${mainWestern.risingDeg}°${mainWestern.risingMin}'`}
          icon={Sunrise}
          iconColor="accent-palm"
          degrees={mainWestern.risingDeg}
          minutes={mainWestern.risingMin}
          isOpen={openSection === 'rising'}
          description={descriptions.rising}
          onClick={() => setOpenSection(openSection === 'rising' ? null : 'rising')}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="w-8 h-8 text-accent-orange animate-spin" />
            <p className="text-primary-dark/60 font-mono text-sm">
              Generating your cosmic reading...
            </p>
          </div>
        ) : currentInterpretation && (
          <InterpretationSection interpretation={currentInterpretation} />
        )}
      </div>
    </div>
  );
}