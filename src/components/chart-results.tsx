import React from 'react';
import { BirthChartResult } from '@/utils/astro-utils';

interface ChartResultsProps {
  mainWestern: BirthChartResult;
  mainVedic: BirthChartResult;
  showTest?: boolean;
}

export function ChartResults({ mainWestern, mainVedic, showTest = false }: ChartResultsProps) {
  return (
    <div className="mt-6 space-y-4">
      <div className="border p-4 rounded-lg">
        <h3 className="font-bold mb-2">Western (Tropical) Results:</h3>
        <p>Sun: {mainWestern.sunSign} {mainWestern.sunDeg}°{mainWestern.sunMin}′</p>
        <p>Moon: {mainWestern.moonSign} {mainWestern.moonDeg}°{mainWestern.moonMin}′</p>
        <p>Rising: {mainWestern.risingSign} {mainWestern.risingDeg}°{mainWestern.risingMin}′</p>
      </div>

      <div className="border p-4 rounded-lg">
        <h3 className="font-bold mb-2">Vedic (Sidereal) Results:</h3>
        <p>Sun: {mainVedic.sunSign} {mainVedic.sunDeg}°{mainVedic.sunMin}′</p>
        <p>Moon: {mainVedic.moonSign} {mainVedic.moonDeg}°{mainVedic.moonMin}′</p>
        <p>Rising: {mainVedic.risingSign} {mainVedic.risingDeg}°{mainVedic.risingMin}′</p>
      </div>

      {showTest && (
        <div className="text-sm text-gray-500 mt-4">
          <p>Test case: 10/14/1980 Ipswich</p>
        </div>
      )}
    </div>
  );
}