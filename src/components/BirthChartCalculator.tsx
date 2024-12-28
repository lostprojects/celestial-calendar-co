import React, { useState } from "react";
import moment from "moment-timezone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BirthChartInput } from "./BirthChartInput";
import { BirthChartResults } from "./BirthChartResults";
import {
  calculateJulianDay,
  calculateSunSign,
  calculateMoonSign,
  calculateRisingSign,
} from "@/utils/astronomyCalculations";

export const BirthChartCalculator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    birthDate: "",
    birthTime: "",
    timeZone: "",
    latitude: "",
    longitude: "",
  });

  const [results, setResults] = useState({
    sunSign: "",
    moonSign: "",
    risingSign: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { birthDate, birthTime, timeZone, latitude, longitude } = formData;

    try {
      const localDateTime = `${birthDate}T${birthTime}`;
      const localMoment = moment.tz(localDateTime, timeZone);
      
      if (!localMoment.isValid()) {
        throw new Error("Invalid date, time, or timezone");
      }

      const utcMoment = localMoment.utc();
      const utcDate = utcMoment.format("YYYY-MM-DD");
      const utcTime = utcMoment.format("HH:mm");

      const julianDay = calculateJulianDay(utcDate, utcTime);
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid latitude or longitude");
      }

      const sunSign = calculateSunSign(julianDay);
      const moonSign = calculateMoonSign(julianDay);
      const risingSign = calculateRisingSign(julianDay, lat, lng);

      setResults({ sunSign, moonSign, risingSign });
      toast({
        title: "Success",
        description: "Birth chart calculated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to calculate birth chart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <BirthChartInput formData={formData} handleChange={handleChange} />
        <Button type="submit" className="w-full">
          Calculate Birth Chart
        </Button>
      </form>
      <BirthChartResults results={results} />
    </div>
  );
};