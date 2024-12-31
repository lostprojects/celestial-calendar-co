import { default as BirthChartForm } from "./birthchart-form";
import { ChartResults } from "./chart-results";
import { useState } from "react";
import { BirthChartResult } from "@/utils/astro-utils";

export const BirthChartSection = () => {
  const [westernResults, setWesternResults] = useState<BirthChartResult | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);

  return (
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
          onResultsCalculated={(results, aiInterpretation) => {
            setWesternResults(results);
            setInterpretation(aiInterpretation);
          }} 
        />
      </div>

      {westernResults && (
        <ChartResults
          mainWestern={westernResults}
          mainVedic={null}
          interpretation={interpretation || undefined}
        />
      )}
    </section>
  );
};