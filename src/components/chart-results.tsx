import { Button } from "@/components/ui/button";

interface ChartResultsProps {
  mainWestern?: {
    sunSign: string;
    sunDeg: number;
    sunMin: number;
    moonSign: string;
    moonDeg: number;
    moonMin: number;
    risingSign: string;
    risingDeg: number;
    risingMin: number;
  };
  mainVedic?: {
    sunSign: string;
    sunDeg: number;
    sunMin: number;
    moonSign: string;
    moonDeg: number;
    moonMin: number;
    risingSign: string;
    risingDeg: number;
    risingMin: number;
  };
}

export const ChartResults = ({ mainWestern, mainVedic }: ChartResultsProps) => {
  const generateTestData = () => {
    // Test data generation logic here
    console.log("Generating test data");
  };

  return (
    <div className="space-y-6">
      <Button 
        onClick={generateTestData}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Generate Test Results
      </Button>

      {mainWestern && mainVedic && (
        <div className="results-display space-y-4">
          <div className="western-results">
            <h3 className="text-lg font-semibold">Western (Tropical) Chart</h3>
            <p>Sun: {mainWestern.sunSign} {mainWestern.sunDeg}°{mainWestern.sunMin}′</p>
            <p>Moon: {mainWestern.moonSign} {mainWestern.moonDeg}°{mainWestern.moonMin}′</p>
            <p>Rising: {mainWestern.risingSign} {mainWestern.risingDeg}°{mainWestern.risingMin}′</p>
          </div>

          <div className="vedic-results">
            <h3 className="text-lg font-semibold">Vedic (Sidereal) Chart</h3>
            <p>Sun: {mainVedic.sunSign} {mainVedic.sunDeg}°{mainVedic.sunMin}′</p>
            <p>Moon: {mainVedic.moonSign} {mainVedic.moonDeg}°{mainVedic.moonMin}′</p>
            <p>Rising: {mainVedic.risingSign} {mainVedic.risingDeg}°{mainVedic.risingMin}′</p>
          </div>
        </div>
      )}
    </div>
  );
};