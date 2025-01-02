import { CalendarGregorianToJD } from "astronomia/julian";
import * as solar from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as sidereal from "astronomia/sidereal";

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export function calculateJulianDay(utcDate: string, utcTime: string): number {
  const [year, month, day] = utcDate.split('-').map(Number);
  const [hour, minute] = utcTime.split(':').map(Number);

  // Get JD for noon on the given date
  const jdNoon = CalendarGregorianToJD(year, month, day);

  // Calculate hours since noon
  const hoursSinceNoon = hour - 12 + minute / 60;

  // If time is after noon, move to the next Julian epoch (+1 day)
  const dayFraction = hoursSinceNoon >= 0 ? 1 + hoursSinceNoon / 24 : hoursSinceNoon / 24;

  // Final JD
  return jdNoon + dayFraction;
}

export function calculateLunarParallax(moonDistance: number): number {
  const earthRadius = 6378.14; // km
  return Math.asin(earthRadius / moonDistance);
}

export function calculateGeocentricLatitude(geographicLat: number): number {
  const latRad = deg2rad(geographicLat);
  return latRad - (0.1924 * Math.sin(2 * latRad));
}

// Updated Moon longitude calculation that stays in radians
export function calculateMoonLongitude(moonPos: { _ra: number; _dec: number }, epsRad: number): number {
  const { _ra: ra, _dec: dec } = moonPos;

  // Compute sine and cosine of the ecliptic longitude (in radians)
  const sinLambda = Math.sin(ra) * Math.cos(epsRad) + Math.tan(dec) * Math.sin(epsRad);
  const cosLambda = Math.cos(ra);

  // Calculate the ecliptic longitude in radians
  const lambdaRad = Math.atan2(sinLambda, cosLambda);

  // Normalize to [0, 2π)
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

// Helper functions for angle conversions
export function deg2rad(degrees: number): number {
  return degrees * Math.PI / 180;
}

export function rad2deg(radians: number): number {
  return radians * 180 / Math.PI;
}

export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}
