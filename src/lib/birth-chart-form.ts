import { useState } from "react";
import { BirthChartData, BirthChartResult, calculateBirthChart } from "@/utils/astro-utils";
import { supabase } from "@/integrations/supabase/client";

export function BirthChartForm() {
  const [westernResults, setWesternResults] = useState<BirthChartResult | null>(null);
  const [vedicResults, setVedicResults] = useState<BirthChartResult | null>(null);

  const generateTestData = () => {
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
      const errorInfo = err instanceof Error ? {
        message: err.message,
        name: err.name
      } : String(err);
      console.error("Test calculation error:", errorInfo);
    }
  };

  const handleSubmit = async (formData: BirthChartData) => {
    try {
      const wChart = calculateBirthChart(formData, "tropical");
      setWesternResults(wChart);

      const sChart = calculateBirthChart(formData, "sidereal");
      setVedicResults(sChart);

      await supabaseInsert(formData, wChart, "tropical");
      await supabaseInsert(formData, sChart, "sidereal");

      console.log("Birth chart calculated:", {
        western: {
          sunSign: wChart.sunSign,
          moonSign: wChart.moonSign,
          risingSign: wChart.risingSign
        },
        vedic: {
          sunSign: sChart.sunSign,
          moonSign: sChart.moonSign,
          risingSign: sChart.risingSign
        }
      });
    } catch (err) {
      const errorInfo = err instanceof Error ? {
        message: err.message,
        name: err.name
      } : String(err);
      console.error("Calculation error:", errorInfo);
      throw err;
    }
  };

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

  return {
    westernResults,
    vedicResults,
    handleSubmit,
    generateTestData
  };
}