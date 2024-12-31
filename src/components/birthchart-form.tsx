import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  calculateBirthChart,
  BirthChartData,
  BirthChartResult,
} from "@/utils/astro-utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LocationSearch } from "./LocationSearch";
import { useToast } from "@/hooks/use-toast";

interface BirthChartFormProps {
  onResultsCalculated: (results: BirthChartResult, interpretation: string | null) => void;
}

export default function BirthChartForm({ onResultsCalculated }: BirthChartFormProps) {
  const [formData, setFormData] = useState<BirthChartData>({
    birthDate: "1980-10-14",
    birthTime: "00:30",
    birthPlace: "",
    latitude: 0,
    longitude: 0,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleLocationSelect = (location: { place: string; lat: number; lng: number }) => {
    console.log("Location selected:", location);
    setFormData({
      ...formData,
      birthPlace: location.place,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  async function getAIInterpretation(chartData: BirthChartResult) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-astro-advice', {
        body: { birthChart: chartData }
      });

      if (error) throw error;
      console.log("AI Interpretation received:", data);
      return data.interpretation;
    } catch (err) {
      console.error("Error getting AI interpretation:", err);
      throw err;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsCalculating(true);
    console.log("Form submitted with data:", formData);
    
    try {
      // Calculate Western only
      console.log("Calculating Western chart...");
      const wChart = calculateBirthChart(formData);
      console.log("Western Chart Results:", wChart);

      // Get AI interpretation
      console.log("Fetching AI interpretation...");
      const aiInterpretation = await getAIInterpretation(wChart);

      // Store in DB
      await supabaseInsert(formData, wChart);

      // Pass results up to parent
      onResultsCalculated(wChart, aiInterpretation);

      toast({
        title: "Success",
        description: "Birth chart calculated and interpreted successfully!",
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
  ) {
    const { error } = await supabase.from("birth_charts").insert({
      name: "Anonymous",
      birth_date: data.birthDate,
      birth_time: data.birthTime,
      birth_place: data.birthPlace,
      latitude: data.latitude,
      longitude: data.longitude,
      system_used: "tropical",
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
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-dark">Birth Date</label>
          <Input
            type="date"
            className="w-full"
            value={formData.birthDate}
            onChange={(e) => {
              console.log("Birth date changed:", e.target.value);
              setFormData({ ...formData, birthDate: e.target.value });
            }}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-dark">Birth Time</label>
          <Input
            type="time"
            className="w-full"
            value={formData.birthTime}
            onChange={(e) => {
              console.log("Birth time changed:", e.target.value);
              setFormData({ ...formData, birthTime: e.target.value });
            }}
            required
          />
        </div>
        
        <LocationSearch onLocationSelect={handleLocationSelect} />
        
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
  );
}