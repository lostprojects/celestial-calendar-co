import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  calculateBirthChart,
  BirthChartData,
  BirthChartResult,
} from "./astro-utils";
import { ChartResults } from "./chart-results";

export default function BirthChartForm() {
  const [formData, setFormData] = useState<BirthChartData>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    latitude: 0,
    longitude: 0,
  });

  // We'll store both Tropical (Western) and Sidereal (Vedic) results
  const [westernResults, setWesternResults] = useState<BirthChartResult | null>(null);
  const [vedicResults, setVedicResults] = useState<BirthChartResult | null>(null);

  const [toast, setToast] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // 1) Calculate Western
      const wChart = calculateBirthChart(formData, "tropical");
      setWesternResults(wChart);

      // 2) Calculate Vedic
      const sChart = calculateBirthChart(formData, "sidereal");
      setVedicResults(sChart);

      // 3) Insert to DB (optional): store both versions
      await supabaseInsert(formData, wChart, "tropical");
      await supabaseInsert(formData, sChart, "sidereal");

      // 4) Quick toast
      setToast(
        `W: Sun: ${wChart.sunSign} ${wChart.sunDeg}°${wChart.sunMin}′, ` +
        `V: Sun: ${sChart.sunSign} ${sChart.sunDeg}°${sChart.sunMin}′`
      );
    } catch (err) {
      setToast("Calculation failed: " + (err as Error).message);
    }
  }

  /**
   * Insert function storing each calculation separately.
   * 'system_used' column could be "tropical" or "sidereal".
   */
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
    <div style={{ padding: 20 }}>
      <h2>Birth Chart Form (Tropical & Vedic, ~5 min accuracy)</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
        />
        <input
          type="time"
          value={formData.birthTime}
          onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
        />
        <input
          placeholder="Birthplace (City/Timezone)"
          value={formData.birthPlace}
          onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={(e) =>
            setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
          }
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={(e) =>
            setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
          }
        />
        <button type="submit">Calculate Both</button>
      </form>

      {toast && <p style={{ marginTop: 10 }}>{toast}</p>}

      {/* Show the results only if both sets are calculated */}
      {westernResults && vedicResults && (
        <ChartResults
          mainWestern={westernResults}
          mainVedic={vedicResults}
          showTest={true} // Toggle the test block with 10/14/1980 Ipswich
        />
      )}
    </div>
  );
}