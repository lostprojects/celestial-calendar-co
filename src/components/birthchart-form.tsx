import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  calculateBirthChart,
  BirthChartData,
  BirthChartResult,
} from "@/utils/astro-utils";
import { ChartResults } from "./chart-results";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LocationSearch } from "./LocationSearch";
import { useToast } from "@/hooks/use-toast";

export default function BirthChartForm() {
  const [formData, setFormData] = useState<BirthChartData>({
    birthDate: "1980-10-14",
    birthTime: "00:30",
    birthPlace: "",
    latitude: 0,
    longitude: 0,
  });

  const [westernResults, setWesternResults] = useState<BirthChartResult | null>(null);
  const [vedicResults, setVedicResults] = useState<BirthChartResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleLocationSelect = (location: { place: string; lat: number; lng: number }) => {
    setFormData({
      ...formData,
      birthPlace: location.place,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsCalculating(true);
    
    try {
      // Calculate Western
      const wChart = calculateBirthChart(formData, "tropical");
      setWesternResults(wChart);

      // Calculate Vedic
      const sChart = calculateBirthChart(formData, "sidereal");
      setVedicResults(sChart);

      // Store in DB
      await supabaseInsert(formData, wChart, "tropical");
      await supabaseInsert(formData, sChart, "sidereal");

      toast({
        title: "Success",
        description: "Birth chart calculated and saved successfully!",
      });
    } catch (err) {
      console.error("Calculation error:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to calculate birth chart",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  }

  async function supabaseInsert(
    data: BirthChartData,
    result: BirthChartResult,
    system: "tropical" | "sidereal"
  ) {
    const { error } = await supabase.from("birth_charts").insert({
      name: "Anonymous", // Add default name since it's required
      birth_date: data.birthDate,
      birth_time: data.birthTime,
      birth_place: data.birthPlace,
      latitude: data.latitude,
      longitude: data.longitude,
      system_used: system,
      sun_sign: result.sunSign,
      sun_degrees: result.sunDeg,
      sun_minutes: result.sunMin,
      moon_sign: result.moonSign,
      moon_degrees: result.moonDeg,
      moon_minutes: result.moonMin,
      ascendant_sign: result.risingSign,
      ascendant_degrees: result.risingDeg,
      ascendant_minutes: result.risingMin,
    });
    if (error) throw error;
  }

  return (
    <div className="birth-chart-form">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-dark">Birth Date</label>
          <Input
            type="date"
            className="w-full"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-dark">Birth Time</label>
          <Input
            type="time"
            className="w-full"
            value={formData.birthTime}
            onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
            required
          />
        </div>
        
        <LocationSearch onLocationSelect={handleLocationSelect} />
        
        <Button 
          type="submit" 
          className="w-full bg-primary text-white"
          disabled={isCalculating}
        >
          {isCalculating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
              <span>Calculating...</span>
            </div>
          ) : (
            "Calculate Birth Chart"
          )}
        </Button>
      </form>

      {(westernResults || vedicResults) && (
        <ChartResults
          mainWestern={westernResults}
          mainVedic={vedicResults}
        />
      )}
    </div>
  );
}