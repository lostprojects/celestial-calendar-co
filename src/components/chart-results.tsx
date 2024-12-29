import React, { useState } from "react";
import { BirthChartResult, calculateBirthChart, BirthChartData } from "@/utils/astro-utils";
import { Button } from "./ui/button";

interface ChartResultsProps {
  mainWestern: BirthChartResult;
  mainVedic: BirthChartResult;
  showTest?: boolean;
}

export function ChartResults({ mainWestern, mainVedic, showTest = false }: ChartResultsProps) {
  const [testW, setTestW] = useState<BirthChartResult | null>(null);
  const [testS, setTestS] = useState<BirthChartResult | null>(null);

  function handleRunTest() {
    const testData: BirthChartData = {
      name: "Test Person",
      birthDate: "1980-10-14",
      birthTime: "00:30",
      birthPlace: "Ipswich, UK",
      latitude: 52.0567,
      longitude: 1.1482,
    };

    const wResult = calculateBirthChart(testData, "tropical");
    const sResult = calculateBirthChart(testData, "sidereal");

    setTestW(wResult);
    setTestS(sResult);
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-primary/10">
          <h3 className="text-xl font-serif mb-4">Western (Tropical) Results</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Sun:</span> {mainWestern.sunSign} {mainWestern.sunDeg}°
              {String(mainWestern.sunMin).padStart(2, "0")}′
            </p>
            <p>
              <span className="font-medium">Moon:</span> {mainWestern.moonSign} {mainWestern.moonDeg}°
              {String(mainWestern.moonMin).padStart(2, "0")}′
            </p>
            <p>
              <span className="font-medium">Rising:</span> {mainWestern.risingSign} {mainWestern.risingDeg}°
              {String(mainWestern.risingMin).padStart(2, "0")}′
            </p>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-primary/10">
          <h3 className="text-xl font-serif mb-4">Vedic (Sidereal) Results</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Sun:</span> {mainVedic.sunSign} {mainVedic.sunDeg}°
              {String(mainVedic.sunMin).padStart(2, "0")}′
            </p>
            <p>
              <span className="font-medium">Moon:</span> {mainVedic.moonSign} {mainVedic.moonDeg}°
              {String(mainVedic.moonMin).padStart(2, "0")}′
            </p>
            <p>
              <span className="font-medium">Rising:</span> {mainVedic.risingSign} {mainVedic.risingDeg}°
              {String(mainVedic.risingMin).padStart(2, "0")}′
            </p>
          </div>
        </div>
      </div>

      {showTest && (
        <div className="mt-8 space-y-6">
          <Button 
            onClick={handleRunTest}
            variant="outline"
            className="w-full"
          >
            Run Test (10/14/1980 00:30 Ipswich UK)
          </Button>

          {testW && testS && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-primary/10">
                <h4 className="text-lg font-serif mb-4">Test Western</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Sun:</span> {testW.sunSign} {testW.sunDeg}°
                    {String(testW.sunMin).padStart(2, "0")}′
                  </p>
                  <p>
                    <span className="font-medium">Moon:</span> {testW.moonSign} {testW.moonDeg}°
                    {String(testW.moonMin).padStart(2, "0")}′
                  </p>
                  <p>
                    <span className="font-medium">Rising:</span> {testW.risingSign} {testW.risingDeg}°
                    {String(testW.risingMin).padStart(2, "0")}′
                  </p>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-primary/10">
                <h4 className="text-lg font-serif mb-4">Test Vedic</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Sun:</span> {testS.sunSign} {testS.sunDeg}°
                    {String(testS.sunMin).padStart(2, "0")}′
                  </p>
                  <p>
                    <span className="font-medium">Moon:</span> {testS.moonSign} {testS.moonDeg}°
                    {String(testS.moonMin).padStart(2, "0")}′
                  </p>
                  <p>
                    <span className="font-medium">Rising:</span> {testS.risingSign} {testS.risingDeg}°
                    {String(testS.risingMin).padStart(2, "0")}′
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}