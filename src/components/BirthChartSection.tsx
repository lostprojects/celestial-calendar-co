import { default as BirthChartForm } from "./birthchart-form";
import { ChartResults } from "./chart-results";
import { useState } from "react";
import { BirthChartResult } from "@/utils/astro-utils";

export const BirthChartSection = () => {
  const [westernResults, setWesternResults] = useState<BirthChartResult | null>(null);
  const [vedicResults, setVedicResults] = useState<BirthChartResult | null>(null);
  const [interpretation, setInterpretation] = useState<string>("");

  return (
    <>
      <section id="birth-chart-section" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-serif font-medium mb-6 text-primary-dark">
              Calculate Your Birth Chart
            </h2>
            <p className="text-lg text-primary-dark/80 font-mono">
              Enter your birth details to receive your personalized celestial roadmap
            </p>
          </div>
          
          <BirthChartForm 
            onResultsCalculated={(western, vedic, interp) => {
              setWesternResults(western);
              setVedicResults(vedic);
              setInterpretation(interp);
            }}
          />
        </div>
      </section>

      {westernResults && (
        <section className="py-24 bg-background">
          <ChartResults 
            mainWestern={westernResults}
            mainVedic={vedicResults}
            interpretation={interpretation}
          />
        </section>
      )}
    </>
  );
};