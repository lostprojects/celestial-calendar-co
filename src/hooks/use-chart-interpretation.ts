import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useToast } from './use-toast';
import { supabase } from '../integrations/supabase/client';
import { BirthChartResult } from '../utils/astro/types';
import { saveBirthChart, saveInterpretation } from '../components/chart-results/SaveChartLogic';
import { logger } from '../lib/logger';
import { createAppError, formatErrorMessage } from '../utils/error-handling';

interface BirthData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
}

interface UseChartInterpretationResult {
  currentInterpretation: string | null;
  isLoading: boolean;
  isSaving: boolean;
  requiresSignup: boolean;
  savedChartId: string | null;
  getAIInterpretation: (forceRefresh?: boolean) => Promise<void>;
}

export function useChartInterpretation(
  mainWestern: BirthChartResult | null,
  birthData?: BirthData
): UseChartInterpretationResult {
  const [currentInterpretation, setCurrentInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [requiresSignup, setRequiresSignup] = useState(false);
  const [savedChartId, setSavedChartId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const user = useUser();

  const checkCache = useCallback((data: BirthData | undefined) => {
    if (!data) return null;
    const cacheKey = `chart-${data.birthDate}-${data.birthTime}-${data.birthPlace}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { chart, interpretation, timestamp } = JSON.parse(cached);
        // Cache valid for 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return { chart, interpretation };
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  }, []);

  const saveToCache = useCallback((data: BirthData | undefined, chart: any, interpretation: string) => {
    if (!data) return;
    const cacheKey = `chart-${data.birthDate}-${data.birthTime}-${data.birthPlace}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      chart,
      interpretation,
      timestamp: Date.now()
    }));
  }, []);

  const getAIInterpretation = async (forceRefresh = false) => {
    logger.info("Starting AI interpretation request", { 
      isAuthenticated: !!user, 
      userId: user?.id 
    });
    
    setIsLoading(true);
    try {
      if (!mainWestern || !birthData) {
        throw createAppError(
          'Birth chart data is required',
          'MISSING_DATA',
          { hasBirthChart: !!mainWestern, hasBirthData: !!birthData }
        );
      }

      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cached = checkCache(birthData);
        if (cached?.interpretation) {
          setCurrentInterpretation(cached.interpretation);
          return;
        }
      }

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
        throw createAppError(
          'Failed to generate astrological interpretation',
          'AI_GENERATION_ERROR',
          { error: interpretationError }
        );
      }

      if (!interpretationData?.interpretation) {
        throw createAppError(
          'No interpretation was generated',
          'EMPTY_INTERPRETATION'
        );
      }

      setCurrentInterpretation(interpretationData.interpretation);
      saveToCache(birthData, mainWestern, interpretationData.interpretation);

      if (birthData) {
        logger.info("Processing birth chart data", { isAuthenticated: !!user });
        
        try {
          setIsSaving(true);
          const chartResult = await saveBirthChart(user, birthData, mainWestern);
          
          if (chartResult.requiresSignup) {
            setRequiresSignup(true);
          } else if (chartResult.id) {
            setSavedChartId(chartResult.id);
            
            const interpretResult = await saveInterpretation(
              chartResult.id,
              user?.id || null,
              interpretationData.interpretation
            );
            
            if (!interpretResult.requiresSignup) {
              toast({
                title: "Success",
                description: "Your birth chart and interpretation have been saved!",
              });
            }
          }
        } catch (dbError: unknown) {
          setIsSaving(false);
          logger.error("Database operation failed", dbError);
          throw createAppError(
            'Failed to save chart or interpretation',
            'DB_SAVE_ERROR',
            { originalError: dbError }
          );
        }
      }

    } catch (error: unknown) {
      logger.error("Error in getAIInterpretation", error);
      toast({
        title: "Error",
        description: formatErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (mainWestern && birthData && !currentInterpretation && !isLoading) {
      logger.debug("Checking cache before triggering AI interpretation");
      const cached = checkCache(birthData);
      if (cached?.interpretation) {
        setCurrentInterpretation(cached.interpretation);
      } else {
        getAIInterpretation();
      }
    }
  }, [mainWestern, birthData]);

  return {
    currentInterpretation,
    isLoading,
    isSaving,
    requiresSignup,
    savedChartId,
    getAIInterpretation
  };
}
