import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

export const CalendarModule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Dummy calendar entry for demonstration
  const dummyEntry = new Date(2025, 0, 15); // January 15, 2025

  // Function to check if a date has an entry
  const hasEntry = (date: Date) => {
    return date.toDateString() === dummyEntry.toDateString();
  };

  // Custom modifier for dates with entries and today
  const modifiers = {
    hasEntry: (date: Date) => hasEntry(date),
    today: (date: Date) => date.toDateString() === new Date().toDateString(),
  };

  // Custom modifier styles
  const modifiersStyles = {
    hasEntry: {
      position: 'relative',
      color: 'inherit',
    },
    today: {
      backgroundColor: '#F1F1F1',
      borderRadius: '4px',
      color: 'inherit',
    },
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
      <div className="flex flex-row items-center justify-between pb-4">
        <h3 className="text-lg font-serif text-accent-lightpalm font-bold">{currentMonth}</h3>
      </div>
      <div className="bg-white rounded-xl [&_.rdp-day_button]:relative [&_.rdp-day_button.hasEntry]:before:content-[''] [&_.rdp-day_button.hasEntry]:before:absolute [&_.rdp-day_button.hasEntry]:before:inset-0 [&_.rdp-day_button.hasEntry]:before:bg-[#D77145] [&_.rdp-day_button.hasEntry]:before:rounded-full [&_.rdp-day_button.hasEntry]:before:transform [&_.rdp-day_button.hasEntry]:before:scale-[1.5] [&_.rdp-day_button.hasEntry]:before:-z-10">
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