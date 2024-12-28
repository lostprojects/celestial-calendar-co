import React from "react";

interface BirthChartResultsProps {
  results: {
    sunSign: string;
    moonSign: string;
    risingSign: string;
  };
}

export const BirthChartResults: React.FC<BirthChartResultsProps> = ({ results }) => {
  if (!results.sunSign) return null;

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-md space-y-3">
      <h3 className="text-xl font-semibold mb-4">Your Birth Chart Results</h3>
      <p className="text-lg">🌞 Sun Sign: <span className="font-medium">{results.sunSign}</span></p>
      <p className="text-lg">🌙 Moon Sign: <span className="font-medium">{results.moonSign}</span></p>
      <p className="text-lg">⬆️ Rising Sign: <span className="font-medium">{results.risingSign}</span></p>
    </div>
  );
};