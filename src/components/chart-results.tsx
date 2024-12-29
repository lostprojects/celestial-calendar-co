import React from "react";
import { BirthChartResult } from "@/utils/astro-utils";

interface ChartResultsProps {
  mainWestern: BirthChartResult;
  mainVedic: BirthChartResult;
}

export function ChartResults({ mainWestern, mainVedic }: ChartResultsProps) {
  return (
    <div className="space-y-6 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Western (Tropical) Chart</h3>
          <div className="space-y-2">
            <p>
              <strong>Sun:</strong> {mainWestern.sunSign} {mainWestern.sunDeg}°
              {String(mainWestern.sunMin).padStart(2, "0")}′
            </p>
            <p>
              <strong>Moon:</strong> {mainWestern.moonSign} {mainWestern.moonDeg}°
              {String(mainWestern.moonMin).padStart(2, "0")}′
            </p>
            <p>
              <strong>Rising:</strong> {mainWestern.risingSign} {mainWestern.risingDeg}°
              {String(mainWestern.risingMin).padStart(2, "0")}′
            </p>
          </div>
        </div>

        <div className="p-6 border rounded-lg shadow-sm opacity-50">
          <h3 className="text-lg font-semibold mb-4">Vedic (Sidereal) Chart - Coming Soon</h3>
          <div className="space-y-2">
            <p>
              <strong>Sun:</strong> {mainVedic.sunSign} {mainVedic.sunDeg}°
              {String(mainVedic.sunMin).padStart(2, "0")}′
            </p>
            <p>
              <strong>Moon:</strong> {mainVedic.moonSign} {mainVedic.moonDeg}°
              {String(mainVedic.moonMin).padStart(2, "0")}′
            </p>
            <p>
              <strong>Rising:</strong> {mainVedic.risingSign} {mainVedic.risingDeg}°
              {String(mainVedic.risingMin).padStart(2, "0")}′
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}