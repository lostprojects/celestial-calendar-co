import React, { useState, useEffect } from "react";
import { BirthChartResult } from "@/utils/astro-utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { saveBirthChart, saveInterpretation } from "./SaveChartLogic";
import { StyledChartResults } from "./StyledChartResults";

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
    console.log("[ChartResults] Starting AI interpretation request");
    console.log("[ChartResults] User state:", { 
      isAuthenticated: !!user, 
      userId: user?.id 
    });
    
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

      if (interpretationError) {
        console.error("[ChartResults] Error from generate-astro-advice:", interpretationError);
        throw interpretationError;
      }

      console.log("[ChartResults] AI Interpretation received:", interpretationData);

      if (!interpretationData?.interpretation) {
        throw new Error('No interpretation generated');
      }

      setCurrentInterpretation(interpretationData.interpretation);
      
      if (user && birthData) {
        console.log("[ChartResults] Attempting to save birth chart and interpretation");
        
        try {
          const birthChartId = await saveBirthChart(user, birthData, mainWestern);
          await saveInterpretation(birthChartId, user.id, interpretationData.interpretation);
          
          console.log("[ChartResults] Successfully saved both birth chart and interpretation");
          
          toast({
            title: "Success",
            description: "Your birth chart and interpretation have been saved!",
            variant: "default",
          });
        } catch (dbError) {
          console.error("[ChartResults] Database operation failed:", dbError);
          throw new Error(`Failed to save chart or interpretation: ${dbError.message}`);
        }
      } else {
        console.log("[ChartResults] Skipping database save - User:", !!user, "Birth data:", !!birthData);
      }

    } catch (error) {
      console.error("[ChartResults] Error in getAIInterpretation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate or save your personal reading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mainWestern && !currentInterpretation && !isLoading) {
      console.log("[ChartResults] Triggering AI interpretation due to mainWestern update");
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
    <StyledChartResults
      mainWestern={mainWestern}
      openSection={openSection}
      setOpenSection={setOpenSection}
      isLoading={isLoading}
      currentInterpretation={currentInterpretation}
      descriptions={descriptions}
    />
  );
}