import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

export const UpcomingReadingsModule = () => {
  const readings = [
    { title: "Birth Chart Reading", date: "Today" },
    { title: "Transit Analysis", date: "Today" },
    { title: "Synastry Reading", date: "Tomorrow" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Upcoming Readings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {readings.map((reading, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center">
              <CheckSquare className="h-5 w-5 text-primary/60" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{reading.title}</p>
            </div>
            <div className="text-sm text-primary/60">{reading.date}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};