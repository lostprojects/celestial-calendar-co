import React, { useState } from "react";
import type { BirthChartData } from "../services/astrology/types";
import { ChartResults } from "./chart-results/ChartResults";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LocationSearch } from "./LocationSearch";
import { useToast } from "../hooks/use-toast";
import { logger } from "../lib/logger";

const DEFAULT_FORM_DATA: BirthChartData = {
  birthDate: "1980-10-14",
  birthTime: "00:30",
  birthPlace: "",
  latitude: 0,
  longitude: 0,
};

export default function BirthChartForm() {
  const [formData, setFormData] = useState<BirthChartData>(DEFAULT_FORM_DATA);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleLocationSelect = (location: { place: string; lat: number; lng: number }) => {
    logger.debug("Location selected", location);
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
    logger.info("Form submitted", formData);
    
    try {
      // Validate form data
      if (!formData.birthPlace || !formData.latitude || !formData.longitude) {
        throw new Error("Please select a valid birth location");
      }

      setShowResults(true);
      toast({
        title: "Success",
        description: "Calculating your birth chart...",
      });
    } catch (err) {
      logger.error("Validation error", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Please check your input",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <>
      <div className="birth-chart-form">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-dark">Birth Date</label>
            <Input
              type="date"
              className="w-full"
              value={formData.birthDate}
              onChange={(e) => {
                logger.debug("Birth date changed", e.target.value);
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
                logger.debug("Birth time changed", e.target.value);
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

      {showResults && (
        <section className="bg-background w-full py-16 mt-24">
          <div className="container mx-auto px-4">
            <ChartResults birthData={formData} />
          </div>
        </section>
      )}
    </>
  );
}
