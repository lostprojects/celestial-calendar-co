import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

export const CalendarModule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
      <div className="flex flex-row items-center justify-between pb-4">
        <h3 className="text-lg font-serif text-accent-lightpalm font-bold">{currentMonth}</h3>
      </div>
      <div className="bg-white rounded-xl">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-xl"
        />
      </div>
    </div>
  );
};