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
  const [toast, setToast] = useState("");

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

      setToast(
        `W: Sun: ${wChart.sunSign} ${wChart.sunDeg}°${wChart.sunMin}′, ` +
        `V: Sun: ${sChart.sunSign} ${sChart.sunDeg}°${sChart.sunMin}′`
      );
    } catch (err) {
      setToast("Calculation failed: " + (err as Error).message);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Name"
            className="w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="date"
            className="w-full"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="time"
            className="w-full"
            value={formData.birthTime}
            onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            placeholder="Birthplace (City/Timezone)"
            className="w-full"
            value={formData.birthPlace}
            onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
          />
        </div>
        
        <div>
          <Input
            type="number"
            step="0.0001"
            placeholder="Latitude"
            className="w-full"
            value={formData.latitude}
            onChange={(e) =>
              setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        
        <div>
          <Input
            type="number"
            step="0.0001"
            placeholder="Longitude"
            className="w-full"
            value={formData.longitude}
            onChange={(e) =>
              setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        
        <Button type="submit" className="w-full bg-primary text-white">
          Calculate Birth Chart
        </Button>
      </form>

      {toast && (
        <p className="mt-4 text-sm text-primary-dark/80">{toast}</p>
      )}

      {westernResults && vedicResults && (
        <ChartResults
          mainWestern={westernResults}
          mainVedic={vedicResults}
          showTest={true}
        />
      )}
    </div>
  );
}