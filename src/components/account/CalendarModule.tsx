import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

export const CalendarModule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Dummy calendar entry for demonstration
  const dummyEntry = new Date(2024, 2, 25); // March 25, 2024

  // Function to check if a date has an entry
  const hasEntry = (date: Date) => {
    return date.toDateString() === dummyEntry.toDateString();
  };

  // Custom modifier for dates with entries
  const modifiers = {
    hasEntry: (date: Date) => hasEntry(date),
  };

  // Custom modifier styles
  const modifiersStyles = {
    hasEntry: {
      border: '2px solid #D77145',
      borderRadius: '50%',
    },
  };

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
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
        />
      </div>
    </div>
  );
};