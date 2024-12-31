import { Sun, Moon, ArrowUp } from "lucide-react";

export const BirthChartSummaryModule = () => {
  // This is placeholder data - in a real implementation, we'd fetch this from Supabase
  const chartData = {
    sunSign: "Libra",
    moonSign: "Taurus",
    risingSign: "Sagittarius"
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
      <h3 className="text-lg font-serif text-primary-dark mb-4">Your Birth Chart</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
          <div className="flex h-8 w-8 items-center justify-center bg-accent-orange/10 rounded-full">
            <Sun className="h-5 w-5 text-accent-orange" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary/60 font-mono">Sun Sign</p>
            <p className="text-base font-serif text-primary-dark">{chartData.sunSign}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
          <div className="flex h-8 w-8 items-center justify-center bg-accent-palm/10 rounded-full">
            <Moon className="h-5 w-5 text-accent-palm" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary/60 font-mono">Moon Sign</p>
            <p className="text-base font-serif text-primary-dark">{chartData.moonSign}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
          <div className="flex h-8 w-8 items-center justify-center bg-accent-lightpalm/10 rounded-full">
            <ArrowUp className="h-5 w-5 text-accent-lightpalm" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary/60 font-mono">Rising Sign</p>
            <p className="text-base font-serif text-primary-dark">{chartData.risingSign}</p>
          </div>
        </div>
      </div>
    </div>
  );
};