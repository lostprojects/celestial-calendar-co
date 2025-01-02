import { CalendarGregorianToJD } from "astronomia/julian";
import * as solar from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as sidereal from "astronomia/sidereal";
import * as nutation from "astronomia/nutation";
import {
  logJulianDayCalculation,
  logDeltaTCalculation,
  logMeanSolarLongitude,
  logEquationOfTime,
  logLunarParallax,
  logGeocentricLatitude,
  logMoonLongitude
} from "@/logging/astro/core-logging";

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export function calculateJulianDay(utcDate: string, utcTime: string): number {
  const [year, month, day] = utcDate.split('-').map(Number);
  const [hour, minute] = utcTime.split(':').map(Number);
  const jdNoon = CalendarGregorianToJD(year, month, day);
  const hoursSinceNoon = hour - 12 + minute / 60;
  const dayFraction = hoursSinceNoon >= 0 ? 1 + hoursSinceNoon / 24 : hoursSinceNoon / 24;
  const result = jdNoon + dayFraction;

  logJulianDayCalculation({
    input: { utcDate, utcTime },
    parsed: { year, month, day, hour, minute },
    intermediate: { jdNoon, hoursSinceNoon, dayFraction },
    result
  });

  return result;
}

export function calculateDeltaT(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const result = 62.92 + 0.32217 * T + 0.005589 * Math.pow(T, 2);

  logDeltaTCalculation({
    input: { jd },
    intermediate: { julianCenturies: T },
    result
  });

  return result;
}

export function calculateMeanSolarLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * Math.pow(T, 2);
  L0 = ((L0 % 360) + 360) % 360;
  return L0;
}

export function calculateEquationOfTime(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  const L0 = calculateMeanSolarLongitude(jde);
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const y = Math.tan(deg2rad(23.44)) * Math.tan(deg2rad(23.44));
  
  const Eq = 4 * rad2deg(
    y * Math.sin(2 * deg2rad(L0)) -
    2 * e * Math.sin(deg2rad(M)) +
    4 * e * y * Math.sin(deg2rad(M)) * Math.cos(2 * deg2rad(L0)) -
    0.5 * y * y * Math.sin(4 * deg2rad(L0)) -
    1.25 * e * e * Math.sin(2 * deg2rad(M))
  );
  
  return Eq;
}

export function calculateLunarParallax(moonDistance: number): number {
  const earthRadius = 6378.14; // km
  return Math.asin(earthRadius / moonDistance);
}

export function calculateGeocentricLatitude(geographicLat: number): number {
  const latRad = deg2rad(geographicLat);
  return latRad - (0.1924 * Math.sin(2 * latRad));
}

export function calculateMoonLongitude(moonPos: { _ra: number; _dec: number }, epsRad: number): number {
  const { _ra: ra, _dec: dec } = moonPos;
  const sinLambda = Math.sin(ra) * Math.cos(epsRad) + Math.tan(dec) * Math.sin(epsRad);
  const cosLambda = Math.cos(ra);
  const lambdaRad = Math.atan2(sinLambda, cosLambda);
  const normalizedLambdaRad = ((lambdaRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return normalizedLambdaRad;
}

export function deg2rad(degrees: number): number {
  return degrees * Math.PI / 180;
}

export function rad2deg(radians: number): number {
  return radians * 180 / Math.PI;
}

export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}
