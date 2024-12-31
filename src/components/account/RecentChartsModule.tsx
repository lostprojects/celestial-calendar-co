import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List } from "lucide-react";

export const RecentChartsModule = () => {
  const charts = [
    { name: "Birth Chart Analysis", date: "April 8" },
    { name: "Relationship Compatibility", date: "April 7" },
    { name: "Career Transit Report", date: "April 6" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Charts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {charts.map((chart, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center">
              <List className="h-5 w-5 text-primary/60" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{chart.name}</p>
            </div>
            <div className="text-sm text-primary/60">{chart.date}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};