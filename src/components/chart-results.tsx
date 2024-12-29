import React from "react";
import { BirthChartResult } from "@/utils/astro-utils";

interface ChartResultsProps {
  mainWestern: BirthChartResult;
  mainVedic: BirthChartResult;
}

export function ChartResults({ mainWestern, mainVedic }: ChartResultsProps) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ padding: "10px", border: "1px solid #ccc", flex: 1 }}>
          <h3>Western (Tropical) Results</h3>
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

        <div style={{ padding: "10px", border: "1px solid #ccc", flex: 1 }}>
          <h3>Vedic (Sidereal) Results</h3>
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
  );
}