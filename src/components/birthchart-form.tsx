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

export default function BirthChartForm() {
  const [formData, setFormData] = useState<BirthChartData>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    latitude: 0,
    longitude: 0,
  });

  const [westernResults, setWesternResults] = useState<BirthChartResult | null>(null);
  const [vedicResults, setVedicResults] = useState<BirthChartResult | null>(null);

  const generateTestData = () => {
    // Test data for Ipswich, UK 1980
    const testData: BirthChartData = {
      name: "Test Person",
      birthDate: "1980-10-14",
      birthTime: "00:30",
      birthPlace: "Ipswich, UK",
      latitude: 52.0567,
      longitude: 1.1482,
    };

    const expectedResults = {
      sunSign: "Libra",
      moonSign: "Libra",
      risingSign: "Leo"
    };
    
    try {
      const wChart = calculateBirthChart(testData, "tropical");
      const sChart = calculateBirthChart(testData, "sidereal");
      
      // Validate Western results
      const isCorrect = 
        wChart.sunSign === expectedResults.sunSign &&
        wChart.moonSign === expectedResults.moonSign &&
        wChart.risingSign === expectedResults.risingSign;

      setWesternResults(wChart);
      setVedicResults(sChart);
      
      if (!isCorrect) {
        console.error("Results don't match expected values:", {
          expected: expectedResults,
          got: {
            sunSign: wChart.sunSign,
            moonSign: wChart.moonSign,
            risingSign: wChart.risingSign
          }
        });
      }
    } catch (err) {
      console.error("Test calculation error:", err);
    }
  };

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

      console.log("Birth chart calculated successfully!");
    } catch (err) {
      console.error("Calculation error:", err);
    }
  }

  async function supabaseInsert(
    data: BirthChartData,
    result: BirthChartResult,
    system: "tropical" | "sidereal"
  ) {
    const { error } = await supabase.from("birth_charts").insert({
      name: data.name,
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
      <Button 
        onClick={generateTestData}
        className="w-full bg-primary hover:bg-primary/90 mb-6"
      >
        Generate Test Results (Ipswich 1980)
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-dark">Name</label>
          <Input
            placeholder="Your Name"
            className="w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
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
        
        <Button type="submit" className="w-full bg-primary text-white">
          Calculate Birth Chart
        </Button>
      </form>

      {westernResults && vedicResults && (
        <div className="mt-8">
          <ChartResults
            mainWestern={westernResults}
            mainVedic={vedicResults}
          />
        </div>
      )}
    </div>
  );
}