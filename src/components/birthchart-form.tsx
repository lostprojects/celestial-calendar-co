import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import {
  calculateBirthChart,
  BirthChartData,
  BirthChartResult,
} from "@/utils/astro-utils";
import { useToast } from "@/hooks/use-toast";
import { StyledBirthChartForm } from "./birth-chart/StyledBirthChartForm";

export default function BirthChartForm() {
  const [formData, setFormData] = useState<BirthChartData>({
    birthDate: "1980-10-14",
    birthTime: "00:30",
    birthPlace: "",
    latitude: 0,
    longitude: 0,
  });

  const [westernResults, setWesternResults] = useState<BirthChartResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  const user = useUser();

  const handleLocationSelect = (location: { place: string; lat: number; lng: number }) => {
    console.log("Location selected:", location);
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
    console.log("Form submitted with data:", formData);
    
    try {
      // Calculate Western only
      console.log("Calculating Western chart...");
      const wChart = calculateBirthChart(formData);
      console.log("Western Chart Results:", wChart);
      setWesternResults(wChart);

      // Store in DB
      await supabaseInsert(formData, wChart);

      toast({
        title: "Success",
        description: "Birth chart calculated successfully!",
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
      user_id: user?.id,
    });
    if (error) throw error;
  }

  return (
    <StyledBirthChartForm
      formData={formData}
      onDateChange={(date) => {
        console.log("Birth date changed:", date);
        setFormData({ ...formData, birthDate: date });
      }}
      onTimeChange={(time) => {
        console.log("Birth time changed:", time);
        setFormData({ ...formData, birthTime: time });
      }}
      onLocationSelect={handleLocationSelect}
      onSubmit={handleSubmit}
      isCalculating={isCalculating}
      westernResults={westernResults}
    />
  );
}