import { LogLevel, shouldLog, formatLogObject, getTimestamp } from '../utils/log-config';
import { BirthChartData, BirthChartResult } from '@/utils/astro-utils';

export function logBirthChartCalculation(params: {
  input: BirthChartData;
  intermediate: {
    timezone: string;
    localDateTime: string;
    utcDateTime: string;
    julianDay: number;
    deltaT: number;
    jde: number;
    solarComponents: {
      meanLongitude: number;
      apparentLongitude: number;
      nutationCorrection: number;
      obliquity: number;
    };
    lunarComponents: {
      distance: number;
      parallax: number;
      position: { _ra: number; _dec: number };
    };
    ascendant: number;
  };
  result: BirthChartResult;
}) {
  if (!shouldLog('DEBUG')) return;
  
  console.log('Birth Chart Calculation:', formatLogObject({
    timestamp: getTimestamp(),
    ...params
  }));
}

export function logZodiacPosition(params: {
  input: { longitude: number };
  intermediate: {
    signIndex: number;
    totalDegrees: number;
    degrees: number;
    minutes: number;
  };
  result: {
    sign: string;
    degrees: number;
    minutes: number;
  };
}) {
  if (!shouldLog('DEBUG')) return;
  
  console.log('Zodiac Position:', formatLogObject({
    timestamp: getTimestamp(),
    ...params
  }));
}

export function logTimezoneDetection(params: {
  input: {
    latitude: number;
    longitude: number;
  };
  result: string;
}) {
  if (!shouldLog('DEBUG')) return;
  
  console.log('Timezone Detection:', formatLogObject({
    timestamp: getTimestamp(),
    ...params
  }));
}