import React, { useState, useEffect } from "react";
import { Sun, Moon, Sunrise, Loader2 } from "lucide-react";
import { BirthSignCard } from "../birth-signs/BirthSignCard";
import { InterpretationSection } from "../interpretation/InterpretationSection";
import { useBirthChart } from "../../hooks/use-birth-chart";
import type { BirthChartData } from "../../services/astrology/types";

interface ChartResultsProps {
  birthData?: BirthChartData;
}

const SIGN_DESCRIPTIONS = {
  sun: "In Western astrology, your Sun sign represents your core identity and basic personality—the essence of who you are. It influences how you express yourself and your fundamental approach to life.",
  moon: "In the Western zodiac, your Moon sign reflects your emotional nature, instincts, and subconscious patterns. It reveals how you process feelings and what makes you feel secure and comfortable.",
  rising: "According to Western astrological tradition, your Rising sign (or Ascendant) is the mask you wear when meeting others. It influences your appearance and how you approach new situations and environments."
} as const;

export function ChartResults({ birthData }: ChartResultsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { 
    westernChart,
    vedicChart,
    interpretation,
    isLoading,
    error,
    calculateCharts,
    getInterpretation
  } = useBirthChart();

  useEffect(() => {
    if (birthData) {
      calculateCharts(birthData);
    }
  }, [birthData, calculateCharts]);

  useEffect(() => {
    if (westernChart && !interpretation) {
      getInterpretation();
    }
  }, [westernChart, interpretation, getInterpretation]);

  if (!westernChart || !vedicChart) return null;

  return (
    <div className="w-screen">
      <div className="max-w-2xl mx-auto px-4">
        <div className="space-y-8">
          <section>
            <h2 className="text-4xl font-serif font-bold text-center text-primary-dark pt-4 pb-8">
              Western Birth Chart Signs
            </h2>
        <BirthSignCard
          sign={westernChart.sunSign}
          position={`${westernChart.sunDeg}°${westernChart.sunMin}'`}
          icon={Sun}
          iconColor="accent-orange"
          degrees={westernChart.sunDeg}
          minutes={westernChart.sunMin}
          isOpen={openSection === 'sun'}
          description={SIGN_DESCRIPTIONS.sun}
          onClick={() => setOpenSection(openSection === 'sun' ? null : 'sun')}
        />

        <BirthSignCard
          sign={westernChart.moonSign}
          position={`${westernChart.moonDeg}°${westernChart.moonMin}'`}
          icon={Moon}
          iconColor="accent-lightpalm"
          degrees={westernChart.moonDeg}
          minutes={westernChart.moonMin}
          isOpen={openSection === 'moon'}
          description={SIGN_DESCRIPTIONS.moon}
          onClick={() => setOpenSection(openSection === 'moon' ? null : 'moon')}
        />

        <BirthSignCard
          sign={westernChart.risingSign}
          position={`${westernChart.risingDeg}°${westernChart.risingMin}'`}
          icon={Sunrise}
          iconColor="accent-palm"
          degrees={westernChart.risingDeg}
          minutes={westernChart.risingMin}
          isOpen={openSection === 'rising'}
          description={SIGN_DESCRIPTIONS.rising}
          onClick={() => setOpenSection(openSection === 'rising' ? null : 'rising')}
        />

          </section>

          <section>
            <h2 className="text-4xl font-serif font-bold text-center text-primary-dark pt-4 pb-8">
              Vedic Birth Chart Signs
            </h2>
          
          <BirthSignCard
            sign={vedicChart.sunSign}
            position={`${vedicChart.sunDeg}°${vedicChart.sunMin}'`}
            icon={Sun}
            iconColor="accent-orange"
            degrees={vedicChart.sunDeg}
            minutes={vedicChart.sunMin}
            isOpen={openSection === 'vedic-sun'}
            description="In Vedic astrology, your Sun sign represents your soul's purpose and your father or authority figures."
            onClick={() => setOpenSection(openSection === 'vedic-sun' ? null : 'vedic-sun')}
          />

          <BirthSignCard
            sign={vedicChart.moonSign}
            position={`${vedicChart.moonDeg}°${vedicChart.moonMin}'`}
            icon={Moon}
            iconColor="accent-lightpalm"
            degrees={vedicChart.moonDeg}
            minutes={vedicChart.moonMin}
            isOpen={openSection === 'vedic-moon'}
            description={`Your Moon is in ${vedicChart.nakshatra.moon} Nakshatra (Pada ${vedicChart.nakshatra.pada}). In Vedic astrology, the Moon and Nakshatra reveal your emotional nature and deepest patterns.`}
            onClick={() => setOpenSection(openSection === 'vedic-moon' ? null : 'vedic-moon')}
          />

          <BirthSignCard
            sign={vedicChart.risingSign}
            position={`${vedicChart.risingDeg}°${vedicChart.risingMin}'`}
            icon={Sunrise}
            iconColor="accent-palm"
            degrees={vedicChart.risingDeg}
            minutes={vedicChart.risingMin}
            isOpen={openSection === 'vedic-rising'}
            description="Your Vedic Rising sign (Lagna) shows how you interact with the world and your physical constitution."
            onClick={() => setOpenSection(openSection === 'vedic-rising' ? null : 'vedic-rising')}
          />
        </section>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Loader2 className="w-8 h-8 text-accent-orange animate-spin" />
              <p className="text-primary-dark/60 font-mono text-sm">
                Generating your cosmic reading...
              </p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              {error.message}
            </div>
          ) : interpretation && (
            <div className="space-y-6">
              <InterpretationSection 
                interpretation={interpretation.content} 
                isBlurred={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
