import React, { useState } from "react";
import moment from "moment-timezone";
import { julian, solar, moonposition, sidereal } from "astronomia";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  birthDate: string;
  birthTime: string;
  timeZone: string;
  latitude: string;
  longitude: string;
}

interface ChartResults {
  sunSign: string;
  moonSign: string;
  risingSign: string;
}

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const BirthChartCalculator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    birthDate: "",
    birthTime: "",
    timeZone: "",
    latitude: "",
    longitude: "",
  });

  const [results, setResults] = useState<ChartResults | null>(null);

  const timeZones = moment.tz.names();

  const convertToUT = (birthDate: string, birthTime: string, timeZone: string) => {
    const localDateTime = `${birthDate}T${birthTime}`;
    const localMoment = moment.tz(localDateTime, timeZone);
    const utcMoment = localMoment.utc();

    return {
      utcDate: utcMoment.format("YYYY-MM-DD"),
      utcTime: utcMoment.format("HH:mm"),
    };
  };

  const calculateJulianDay = (utcDate: string, utcTime: string) => {
    const [year, month, day] = utcDate.split("-").map(Number);
    const [hour, minute] = utcTime.split(":").map(Number);
    const fractionalDay = hour / 24 + minute / 1440;
    return julian.CalendarGregorianToJD(year, month, day + fractionalDay);
  };

  const getZodiacSign = (longitude: number) => {
    const normalizedLongitude = ((longitude % 360) + 360) % 360;
    return zodiacSigns[Math.floor(normalizedLongitude / 30)];
  };

  const calculateSunSign = (jd: number) => {
    const sunLongitude = solar.apparentLongitude(jd);
    return getZodiacSign(sunLongitude);
  };

  const calculateMoonSign = (jd: number) => {
    const moonLongitude = moonposition.position(jd).lon;
    return getZodiacSign(moonLongitude);
  };

  const calculateRisingSign = (jd: number, lat: number, lon: number) => {
    const lst = sidereal.apparent(jd);
    // Simple ascendant calculation (approximate)
    const ascendant = (lst * 15 + lon + 180) % 360;
    return getZodiacSign(ascendant);
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    const { latitude, longitude } = formData;
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw new Error("Latitude must be between -90 and 90 degrees");
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      throw new Error("Longitude must be between -180 and 180 degrees");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      validateInputs();
      const { birthDate, birthTime, timeZone, latitude, longitude } = formData;

      const { utcDate, utcTime } = convertToUT(birthDate, birthTime, timeZone);
      const julianDay = calculateJulianDay(utcDate, utcTime);

      const sunSign = calculateSunSign(julianDay);
      const moonSign = calculateMoonSign(julianDay);
      const risingSign = calculateRisingSign(
        julianDay,
        parseFloat(latitude),
        parseFloat(longitude)
      );

      setResults({ sunSign, moonSign, risingSign });
      
      toast({
        title: "Chart Calculated Successfully",
        description: "Your birth chart has been calculated.",
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
    <div className="w-full max-w-md mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Birth Date</label>
          <Input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Birth Time (24h)</label>
          <Input
            type="time"
            value={formData.birthTime}
            onChange={(e) => handleChange("birthTime", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Time Zone</label>
          <Select
            value={formData.timeZone}
            onValueChange={(value) => handleChange("timeZone", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time zone" />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((zone) => (
                <SelectItem key={zone} value={zone}>
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Latitude</label>
          <Input
            type="text"
            placeholder="e.g., 40.7128"
            value={formData.latitude}
            onChange={(e) => handleChange("latitude", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Longitude</label>
          <Input
            type="text"
            placeholder="e.g., -74.0060"
            value={formData.longitude}
            onChange={(e) => handleChange("longitude", e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Calculate Birth Chart
        </Button>
      </form>

      {results && (
        <div className="space-y-4 p-6 bg-accent-sage/20 rounded-lg">
          <h3 className="text-xl font-serif font-medium text-center mb-4">Your Birth Chart</h3>
          <div className="space-y-2">
            <p className="flex items-center justify-between">
              <span>Sun Sign:</span>
              <span className="font-medium">{results.sunSign}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Moon Sign:</span>
              <span className="font-medium">{results.moonSign}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Rising Sign:</span>
              <span className="font-medium">{results.risingSign}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};