import React, { useState } from "react";
import { BirthChartResult, calculateBirthChart, BirthChartData } from "@/utils/astro-utils";

interface ChartResultsProps {
  // The "primary" results the user just calculated:
  mainWestern: BirthChartResult;
  mainVedic: BirthChartResult;

  // Toggle block for side-by-side test of 10/14/1980 00:30 Ipswich UK
  showTest?: boolean;
}

/**
 * Displays both Western (Tropical) and Vedic (Sidereal) results,
 * plus an optional test block for 10/14/1980 00:30 Ipswich UK.
 */
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

    // Compute both Western & Vedic for test
    const wResult = calculateBirthChart(testData, "tropical");
    const sResult = calculateBirthChart(testData, "sidereal");

    setTestW(wResult);
    setTestS(sResult);
  }

  return (
    <div style={{ marginTop: 10 }}>
      {/* Primary user-chosen Western & Vedic */}
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

      {/* Optional test block */}
      {showTest && (
        <div style={{ marginTop: 20 }}>
          <button onClick={handleRunTest}>
            Run Test (10/14/1980 00:30 Ipswich UK)
          </button>

          {testW && testS && (
            <div style={{ marginTop: 10, display: "flex", gap: "2rem" }}>
              <div style={{ padding: "10px", border: "1px solid #ccc", flex: 1 }}>
                <h4>Test Western</h4>
                <p>
                  <strong>Sun:</strong> {testW.sunSign} {testW.sunDeg}°
                  {String(testW.sunMin).padStart(2, "0")}′
                </p>
                <p>
                  <strong>Moon:</strong> {testW.moonSign} {testW.moonDeg}°
                  {String(testW.moonMin).padStart(2, "0")}′
                </p>
                <p>
                  <strong>Rising:</strong> {testW.risingSign} {testW.risingDeg}°
                  {String(testW.risingMin).padStart(2, "0")}′
                </p>
              </div>

              <div style={{ padding: "10px", border: "1px solid #ccc", flex: 1 }}>
                <h4>Test Vedic</h4>
                <p>
                  <strong>Sun:</strong> {testS.sunSign} {testS.sunDeg}°
                  {String(testS.sunMin).padStart(2, "0")}′
                </p>
                <p>
                  <strong>Moon:</strong> {testS.moonSign} {testS.moonDeg}°
                  {String(testS.moonMin).padStart(2, "0")}′
                </p>
                <p>
                  <strong>Rising:</strong> {testS.risingSign} {testS.risingDeg}°
                  {String(testS.risingMin).padStart(2, "0")}′
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}