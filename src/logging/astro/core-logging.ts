import { LogLevel, shouldLog, formatLogObject, getTimestamp } from '../utils/log-config';

export function logJulianDayCalculation(params: {
  input: { utcDate: string; utcTime: string };
  parsed: { year: number; month: number; day: number; hour: number; minute: number };
  intermediate: { jdNoon: number; hoursSinceNoon: number; dayFraction: number };
  result: number;
}) {
  if (!shouldLog('DEBUG')) return;
  
  console.log('Julian Day Calculation:', formatLogObject({
    timestamp: getTimestamp(),
    ...params
  }));
}

export function logDeltaTCalculation(params: {
  input: { jd: number };
  intermediate: { julianCenturies: number };
  result: number;
}) {
  if (!shouldLog('DEBUG')) return;
  
  console.log('Delta T Calculation:', formatLogObject({
    timestamp: getTimestamp(),
    ...params
  }));
}

export function logMeanSolarLongitude(params: {
  input: { jde: number };
  intermediate: { 
    julianCenturies: number;
    baseAngle: number;
  };
  result: number;
}) {
  if (!shouldLog('DEBUG')) return;
  
  console.log('Mean Solar Longitude:', formatLogObject({
    timestamp: getTimestamp(),
    ...params
  }));
}

export function logEquationOfTime(params: {
  input: { jde: number };
  intermediate: {
    meanLongitude: number;
    eccentricity: number;
    meanAnomaly: number;
    obliquityFactor: number;
  };
  result: number;
}) {
  if (!shouldLog('DEBUG')) return;
  
  console.log('Equation of Time:', formatLogObject({
    timestamp: getTimestamp(),
    ...params
  }));
}

export function logLunarParallax(params: {
  input: { moonDistance: number };
  intermediate: { earthRadius: number };
  result: number;
}) {
  if (!shouldLog('DEBUG')) return;
  
  console.log('Lunar Parallax:', formatLogObject({
    timestamp: getTimestamp(),
    ...params
  }));
}

export function logGeocentricLatitude(params: {
  input: { geographicLat: number };
  intermediate: { latRad: number };
  result: number;
}) {
  if (!shouldLog('DEBUG')) return;
  
  console.log('Geocentric Latitude:', formatLogObject({
    timestamp: getTimestamp(),
    ...params
  }));
}

export function logMoonLongitude(params: {
  input: { moonPos: { _ra: number; _dec: number }; epsRad: number };
  intermediate: {
    sinLambda: number;
    cosLambda: number;
    lambdaRad: number;
  };
  result: number;
}) {
  if (!shouldLog('DEBUG')) return;
  
  console.log('Moon Longitude:', formatLogObject({
    timestamp: getTimestamp(),
    ...params
  }));
}