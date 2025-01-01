import { BirthChartResult } from "@/utils/astro-utils";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/auth-helpers-react";

export async function saveBirthChart(
  user: User | null,
  birthData: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
  } | undefined,
  mainWestern: BirthChartResult
) {
  console.log("[SaveChartLogic] Starting birth chart save process");
  console.log("[SaveChartLogic] User state:", { 
    isAuthenticated: !!user, 
    userId: user?.id,
    email: user?.email 
  });
  console.log("[SaveChartLogic] Birth data:", birthData);
  console.log("[SaveChartLogic] Western chart data:", mainWestern);

  if (!user) {
    console.log("[SaveChartLogic] Error: No user found");
    throw new Error('User must be logged in to save birth chart');
  }

  if (!birthData) {
    console.log("[SaveChartLogic] Error: No birth data provided");
    throw new Error('Birth data is required to save chart');
  }

  try {
    console.log("[SaveChartLogic] Inserting birth chart into database...");
    const { data: birthChartData, error: birthChartError } = await supabase
      .from('birth_charts')
      .insert({
        name: birthData.birthPlace.split(',')[0],
        birth_date: birthData.birthDate,
        birth_time: birthData.birthTime,
        birth_place: birthData.birthPlace,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        sun_sign: mainWestern.sunSign,
        moon_sign: mainWestern.moonSign,
        ascendant_sign: mainWestern.risingSign,
        sun_degrees: mainWestern.sunDeg,
        sun_minutes: mainWestern.sunMin,
        moon_degrees: mainWestern.moonDeg,
        moon_minutes: mainWestern.moonMin,
        ascendant_degrees: mainWestern.risingDeg,
        ascendant_minutes: mainWestern.risingMin,
        user_id: user.id
      })
      .select('id')
      .single();

    if (birthChartError) {
      console.error("[SaveChartLogic] Error storing birth chart:", birthChartError);
      throw birthChartError;
    }

    console.log("[SaveChartLogic] Birth chart stored successfully:", birthChartData);
    return birthChartData.id;
  } catch (error) {
    console.error("[SaveChartLogic] Failed to save birth chart:", error);
    throw error;
  }
}

export async function saveInterpretation(
  birthChartId: string,
  userId: string,
  interpretation: string
) {
  console.log("[SaveChartLogic] Starting interpretation save process");
  console.log("[SaveChartLogic] Parameters:", { birthChartId, userId });

  try {
    const { data, error } = await supabase
      .from('interpretations')
      .insert({
        birth_chart_id: birthChartId,
        content: interpretation,
        user_id: userId
      })
      .select('id')
      .single();

    if (error) {
      console.error("[SaveChartLogic] Error saving interpretation:", error);
      throw error;
    }

    console.log("[SaveChartLogic] Interpretation saved successfully:", data);
    return data;
  } catch (error) {
    console.error("[SaveChartLogic] Failed to save interpretation:", error);
    throw error;
  }
}