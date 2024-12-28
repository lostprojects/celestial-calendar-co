interface BirthChartResult {
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
}

interface BirthChartDisplayProps {
  results: BirthChartResult;
}

export const BirthChartDisplay = ({ results }: BirthChartDisplayProps) => {
  console.log('Displaying birth chart results:', results);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Birth Chart Results</h2>
      <div className="space-y-4">
        <div className="p-4 border rounded-md">
          <p className="font-medium text-lg mb-1">Sun Sign</p>
          <p className="text-primary-dark">{results.sunSign}</p>
        </div>
        <div className="p-4 border rounded-md">
          <p className="font-medium text-lg mb-1">Moon Sign</p>
          <p className="text-primary-dark">{results.moonSign}</p>
        </div>
        <div className="p-4 border rounded-md">
          <p className="font-medium text-lg mb-1">Ascendant Sign</p>
          <p className="text-primary-dark">{results.ascendantSign}</p>
        </div>
      </div>
    </div>
  );
};