import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { chartService } from '../services/astrology/chart-service';
import type { 
  BirthChartData,
  ChartState,
  WesternChartResult,
  VedicChartResult,
  ChartInterpretation
} from '../services/astrology/types';
import { logger } from '../lib/logger';

interface UseBirthChartResult extends ChartState {
  calculateCharts: (data: BirthChartData) => Promise<void>;
  getInterpretation: (forceRefresh?: boolean) => Promise<void>;
  clearCharts: () => void;
}

export function useBirthChart(): UseBirthChartResult {
  const [state, setState] = useState<ChartState>(chartService.getState());
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = chartService.subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, []);

  const calculateCharts = useCallback(async (data: BirthChartData) => {
    try {
      // Calculate both Western and Vedic charts
      const [western, vedic] = await Promise.all([
        chartService.calculateWesternChart(data),
        chartService.calculateVedicChart(data)
      ]);

      logger.info("Charts calculated successfully", {
        western: {
          sunSign: western.sunSign,
          moonSign: western.moonSign,
          risingSign: western.risingSign
        },
        vedic: {
          sunSign: vedic.sunSign,
          moonSign: vedic.moonSign,
          risingSign: vedic.risingSign,
          nakshatra: vedic.nakshatra
        }
      });

    } catch (error) {
      logger.error("Chart calculation failed", { error });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to calculate birth chart",
        variant: "destructive",
      });
    }
  }, [toast]);

  const getInterpretation = useCallback(async (forceRefresh = false) => {
    try {
      if (!state.westernChart) {
        throw new Error("Western chart must be calculated first");
      }

      // For now, we'll just interpret the Western chart
      // In the future, this could combine both Western and Vedic insights
      await chartService.interpretChart(state.westernChart);

    } catch (error) {
      logger.error("Interpretation failed", { error });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get interpretation",
        variant: "destructive",
      });
    }
  }, [state.westernChart, toast]);

  const clearCharts = useCallback(() => {
    setState({
      westernChart: null,
      vedicChart: null,
      interpretation: null,
      isLoading: false,
      error: null
    });
    chartService.clearCache();
  }, []);

  return {
    ...state,
    calculateCharts,
    getInterpretation,
    clearCharts
  };
}
