import { List } from "lucide-react";

export const RecentChartsModule = () => {
  const charts = [
    { name: "Birth Chart Analysis", date: "April 8" },
    { name: "Relationship Compatibility", date: "April 7" },
    { name: "Career Transit Report", date: "April 6" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
      <h3 className="text-lg font-serif text-primary-dark mb-4">Recent Charts</h3>
      <div className="space-y-4">
        {charts.map((chart, index) => (
          <div key={index} className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
            <div className="flex h-6 w-6 items-center justify-center">
              <List className="h-5 w-5 text-primary/60" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-dark">{chart.name}</p>
            </div>
            <div className="text-sm text-primary/60 font-mono">{chart.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};