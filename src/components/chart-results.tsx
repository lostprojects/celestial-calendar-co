import React, { useState, useEffect } from "react";
import { BirthChartResult } from "@/utils/astro-utils";
import { Sun, Moon, Sunrise, Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BirthSignCard } from "./birth-signs/BirthSignCard";
import { InterpretationSection } from "./interpretation/InterpretationSection";
import { useUser } from "@supabase/auth-helpers-react";

interface ChartResultsProps {
  mainWestern: BirthChartResult | null;
  mainVedic: BirthChartResult | null;
  birthData?: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
  };
  interpretation?: string;
}

export function ChartResults({ mainWestern, mainVedic, birthData }: ChartResultsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [currentInterpretation, setCurrentInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const user = useUser();

  const getAIInterpretation = async () => {
    setIsLoading(true);
    try {
      const { data: interpretationData, error: interpretationError } = await supabase.functions.invoke('generate-astro-advice', {
        body: { 
          birthChart: mainWestern,
          format: {
            sections: [
              { title: "Your Cosmic Essence", icon: "star" },
              { title: "Emotional Landscape", icon: "heart" },
              { title: "Life Path & Purpose", icon: "gem" },
              { title: "Personal Growth", icon: "leaf" }
            ]
          }
        }
      });

      if (interpretationError) throw interpretationError;

      console.log("AI Interpretation received:", interpretationData);
      
      if (user && birthData) {
        // First, insert the birth chart with all required fields
        const { data: birthChartData, error: birthChartError } = await supabase
          .from('birth_charts')
          .insert({
            name: birthData.birthPlace.split(',')[0], // Use first part of location as name
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
          console.error("Error storing birth chart:", birthChartError);
          throw birthChartError;
        }

        console.log("Birth chart stored successfully:", birthChartData);

        // Then, store the interpretation
        const { error: interpretationStoreError } = await supabase
          .from('interpretations')
          .insert({
            birth_chart_id: birthChartData.id,
            content: interpretationData.interpretation,
            user_id: user.id
          });

        if (interpretationStoreError) {
          console.error("Error storing interpretation:", interpretationStoreError);
          throw interpretationStoreError;
        }

        console.log("Interpretation stored successfully");
      }

      setCurrentInterpretation(interpretationData.interpretation);
    } catch (error) {
      console.error("Error getting or storing AI interpretation:", error);
      toast({
        title: "Error",
        description: "Failed to generate or save your personal reading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically generate interpretation when birth chart is available
  useEffect(() => {
    if (mainWestern && !currentInterpretation && !isLoading) {
      getAIInterpretation();
    }
  }, [mainWestern]);

  if (!mainWestern) return null;

  const descriptions = {
    sun: "Your Sun sign represents your core identity and basic personality—the essence of who you are. It influences how you express yourself and your fundamental approach to life.",
    moon: "Your Moon sign reflects your emotional nature, instincts, and subconscious patterns. It reveals how you process feelings and what makes you feel secure and comfortable.",
    rising: "Your Rising sign (or Ascendant) is the mask you wear when meeting others. It influences your appearance and how you approach new situations and environments."
  };

  return (
    <div className="w-screen">
      <h2 className="text-4xl font-serif font-bold text-center text-primary-dark pt-4 pb-8">
        Your Birth Signs
      </h2>
      
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        <BirthSignCard
          sign={mainWestern.sunSign}
          position={`${mainWestern.sunDeg}°${mainWestern.sunMin}'`}
          icon={Sun}
          iconColor="accent-orange"
          degrees={mainWestern.sunDeg}
          minutes={mainWestern.sunMin}
          isOpen={openSection === 'sun'}
          description={descriptions.sun}
          onClick={() => setOpenSection(openSection === 'sun' ? null : 'sun')}
        />

        <BirthSignCard
          sign={mainWestern.moonSign}
          position={`${mainWestern.moonDeg}°${mainWestern.moonMin}'`}
          icon={Moon}
          iconColor="accent-lightpalm"
          degrees={mainWestern.moonDeg}
          minutes={mainWestern.moonMin}
          isOpen={openSection === 'moon'}
          description={descriptions.moon}
          onClick={() => setOpenSection(openSection === 'moon' ? null : 'moon')}
        />

        <BirthSignCard
          sign={mainWestern.risingSign}
          position={`${mainWestern.risingDeg}°${mainWestern.risingMin}'`}
          icon={Sunrise}
          iconColor="accent-palm"
          degrees={mainWestern.risingDeg}
          minutes={mainWestern.risingMin}
          isOpen={openSection === 'rising'}
          description={descriptions.rising}
          onClick={() => setOpenSection(openSection === 'rising' ? null : 'rising')}
        />

        {/* AI Interpretation Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="w-8 h-8 text-accent-orange animate-spin" />
            <p className="text-primary-dark/60 font-mono text-sm">
              Generating your cosmic reading...
            </p>
          </div>
        ) : currentInterpretation && (
          <InterpretationSection interpretation={currentInterpretation} />
        )}
      </div>
    </div>
  );
}