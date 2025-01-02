import { CalendarGregorianToJD } from "astronomia/julian";
import * as solar from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as sidereal from "astronomia/sidereal";
import * as eqtime from "astronomia/eqtime";

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export function calculateDeltaT(jd: number): number {
  const T = (jd - 2451545.0) / 36525;  // Julian centuries since J2000.0
  return 62.92 + 0.32217 * T + 0.005589 * Math.pow(T, 2);
}

export function calculateJulianDay(utcDate: string, utcTime: string): number {
  const [year, month, day] = utcDate.split('-').map(Number);
  const [hour, minute] = utcTime.split(':').map(Number);
  const jdNoon = CalendarGregorianToJD(year, month, day);
  const hoursSinceNoon = hour - 12 + minute / 60;
  const dayFraction = hoursSinceNoon >= 0 ? 1 + hoursSinceNoon / 24 : hoursSinceNoon / 24;
  return jdNoon + dayFraction;
}

export function calculateEquationOfTime(jde: number): number {
  return eqtime.equation(jde);
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
  
  console.log("Moon calculation steps:", {
    ra,
    dec,
    epsRad,
    sinLambda,
    cosLambda,
    lambdaRad,
    normalizedLambdaRad
  });
  
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