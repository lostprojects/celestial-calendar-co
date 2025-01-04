import { ZODIAC_SIGNS } from './core';

export type ZodiacSign = typeof ZODIAC_SIGNS[number];

export interface BirthChartData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface AstronomicalConstants {
  obliquity: number;
  nutationLong: number;
  nutationObl: number;
  jde: number;
  deltaT: number;
}

interface BaseChartResult {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
  sunDeg: number;
  sunMin: number;
  moonDeg: number;
  moonMin: number;
  risingDeg: number;
  risingMin: number;
  absolutePositions: {
    sun: number;
    moon: number;
    ascending: number;
  };
  calculation: {
    jde: number;
    deltaT: number;
    obliquity: number;
    nutationLong: number;
    nutationObl: number;
  };
}

export interface WesternChartResult extends BaseChartResult {
  system: 'western';
}

export interface VedicChartResult extends BaseChartResult {
  system: 'vedic';
  nakshatra: {
    moon: string;
    pada: number;
  };
  dashas: {
    current: string;
    remaining: number;
  };
}

export type ChartResult = WesternChartResult | VedicChartResult;

export interface ChartInterpretation {
  id?: string;
  chartId: string;
  userId?: string | null;
  content: string;
  sections: {
    title: string;
    content: string;
    icon?: string;
  }[];
  metadata: {
    generatedAt: string;
    version: string;
    model?: string;
  };
}

export interface ChartCache {
  chart: ChartResult;
  interpretation: ChartInterpretation;
  timestamp: number;
}

export interface ChartState {
  westernChart: WesternChartResult | null;
  vedicChart: VedicChartResult | null;
  interpretation: ChartInterpretation | null;
  isLoading: boolean;
  error: Error | null;
}

export interface ChartService {
  calculateWesternChart(data: BirthChartData): Promise<WesternChartResult>;
  calculateVedicChart(data: BirthChartData): Promise<VedicChartResult>;
  interpretChart(chart: ChartResult): Promise<ChartInterpretation>;
  saveChart(chart: ChartResult, userId?: string): Promise<string>;
  loadChart(chartId: string): Promise<ChartResult>;
}

export interface CacheService {
  get(key: string): Promise<ChartCache | null>;
  set(key: string, data: ChartCache): Promise<void>;
  clear(): Promise<void>;
}
