import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocationSearch } from "@/components/LocationSearch";
import { BirthChartData, BirthChartResult } from "@/utils/astro-utils";
import { ChartResults } from "../chart-results/ChartResults";

interface StyledBirthChartFormProps {
  formData: BirthChartData;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onLocationSelect: (location: { place: string; lat: number; lng: number }) => void;
  onSubmit: (e: React.FormEvent) => void;
  isCalculating: boolean;
  westernResults: BirthChartResult | null;
}

export const StyledBirthChartForm: React.FC<StyledBirthChartFormProps> = ({
  formData,
  onDateChange,
  onTimeChange,
  onLocationSelect,
  onSubmit,
  isCalculating,
  westernResults,
}) => {
  return (
    <>
      <div className="birth-chart-form">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-dark">Birth Date</label>
            <Input
              type="date"
              className="w-full"
              value={formData.birthDate}
              onChange={(e) => onDateChange(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-dark">Birth Time</label>
            <Input
              type="time"
              className="w-full"
              value={formData.birthTime}
              onChange={(e) => onTimeChange(e.target.value)}
              required
            />
          </div>
          
          <LocationSearch onLocationSelect={onLocationSelect} />
          
          <Button 
            type="submit" 
            className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-6 text-base rounded-lg font-mono relative overflow-hidden group"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                <span className="relative z-10 font-bold">Calculating...</span>
              </div>
            ) : (
              <span className="relative z-10 font-bold">Calculate Birth Chart</span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-accent-orange/90 to-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </form>
      </div>

      {westernResults && (
        <section className="bg-background w-full py-16 mt-24">
          <div className="container mx-auto px-4">
            <ChartResults
              mainWestern={westernResults}
              mainVedic={null}
              interpretation={undefined}
            />
          </div>
        </section>
      )}
    </>
  );
};