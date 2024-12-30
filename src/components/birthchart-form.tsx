import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateBirthChart, BirthChartData } from "@/utils/astro-utils";
import { ChartResults } from "./chart-results";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LocationSearch } from "./LocationSearch";
import { BirthChartForm as BirthChartFormLogic } from "@/lib/birth-chart-form";
import { useToast } from "@/hooks/use-toast";

export default function BirthChartForm() {
  const [formData, setFormData] = useState<BirthChartData>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    latitude: 0,
    longitude: 0,
  });

  const { toast } = useToast();
  const { 
    westernResults, 
    vedicResults, 
    handleSubmit: handleFormSubmit,
    generateTestData: generateTest 
  } = BirthChartFormLogic();

  const handleLocationSelect = (location: { place: string; lat: number; lng: number }) => {
    setFormData({
      ...formData,
      birthPlace: location.place,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleFormSubmit(formData);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to calculate birth chart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="birth-chart-form">
      <Button 
        onClick={generateTest}
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