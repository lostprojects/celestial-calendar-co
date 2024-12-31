import { CheckSquare } from "lucide-react";

export const UpcomingReadingsModule = () => {
  const readings = [
    { title: "Birth Chart Reading", date: "Today" },
    { title: "Transit Analysis", date: "Today" },
    { title: "Synastry Reading", date: "Tomorrow" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
      <h3 className="text-lg font-serif text-primary-dark mb-4">Upcoming Readings</h3>
      <div className="space-y-4">
        {readings.map((reading, index) => (
          <div key={index} className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
            <div className="flex h-6 w-6 items-center justify-center">
              <CheckSquare className="h-5 w-5 text-primary/60" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-dark">{reading.title}</p>
            </div>
            <div className="text-sm text-primary/60 font-mono">{reading.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};