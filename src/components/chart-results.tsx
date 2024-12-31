import React, { useState } from "react";
import { BirthChartResult } from "@/utils/astro-utils";
import { Sun, Moon, Sunrise, Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BirthSignCard } from "./birth-signs/BirthSignCard";
import { InterpretationSection } from "./interpretation/InterpretationSection";

interface ChartResultsProps {
  mainWestern: BirthChartResult | null;
  mainVedic: BirthChartResult | null;
  interpretation?: string;
}

export function ChartResults({ mainWestern }: ChartResultsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [currentInterpretation, setCurrentInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!mainWestern) return null;

  console.log("ChartResults received Western:", mainWestern);

  const descriptions = {
    sun: "Your Sun sign represents your core identity and basic personality—the essence of who you are. It influences how you express yourself and your fundamental approach to life.",
    moon: "Your Moon sign reflects your emotional nature, instincts, and subconscious patterns. It reveals how you process feelings and what makes you feel secure and comfortable.",
    rising: "Your Rising sign (or Ascendant) is the mask you wear when meeting others. It influences your appearance and how you approach new situations and environments."
  };

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
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      // Find the matching birth chart
      const { data: birthChartData } = await supabase
        .from('birth_charts')
        .select('id')
        .eq('sun_sign', mainWestern.sunSign)
        .eq('moon_sign', mainWestern.moonSign)
        .eq('ascendant_sign', mainWestern.risingSign)
        .single();

      if (birthChartData) {
        // Store the interpretation
        const { error: storageError } = await supabase
          .from('interpretations')
          .insert([{
            birth_chart_id: birthChartData.id,
            content: interpretationData.interpretation,
            user_id: user?.id || null
          }]);

        if (storageError) {
          console.error("Error storing interpretation:", storageError);
        }
      }

      setCurrentInterpretation(interpretationData.interpretation);
    } catch (error) {
      console.error("Error getting AI interpretation:", error);
      toast({
        title: "Error",
        description: "Failed to generate your personal reading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

        {/* AI Interpretation Button */}
        <div className="pt-12 text-center">
          <Button
            onClick={getAIInterpretation}
            disabled={isLoading}
            className="bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-6 text-lg rounded-lg font-mono relative overflow-hidden group animate-float"
          >
            <span className="relative z-10 font-bold flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Your Reading...
                </>
              ) : (
                <>
                  Get Your Personal Reading
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-accent-orange/90 to-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>

        {/* AI Interpretation Section */}
        {currentInterpretation && (
          <InterpretationSection interpretation={currentInterpretation} />
        )}
      </div>
    </div>
  );
}