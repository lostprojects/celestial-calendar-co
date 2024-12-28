interface BirthChartResult {
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
}

interface BirthChartDisplayProps {
  results: BirthChartResult;
}

export const BirthChartDisplay = ({ results }: BirthChartDisplayProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Birth Chart Results</h2>
      <div className="space-y-2">
        <p><span className="font-medium">Sun Sign:</span> {results.sunSign}</p>
        <p><span className="font-medium">Moon Sign:</span> {results.moonSign}</p>
        <p><span className="font-medium">Ascendant Sign:</span> {results.ascendantSign}</p>
      </div>
    </div>
  );
};