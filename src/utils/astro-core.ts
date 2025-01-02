import { CalendarGregorianToJD } from "astronomia/julian";
import * as solar from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as sidereal from "astronomia/sidereal";

/** 
 * Astronomical constants 
 */
export const ASTRONOMICAL_CONSTANTS = {
  EARTH_RADIUS_KM: 6378.14,
  J2000_EPOCH: 2451545.0,
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI,
  HOURS_TO_DEGREES: 15, // 360° / 24h
  OBLIQUITY_J2000: 23.4392911,
  FLATTENING_FACTOR: 0.1924 // For geocentric latitude calculation
} as const;

/**
 * Zodiac signs in standard order
 */
export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

/**
 * Type for celestial object position
 */
export interface CelestialPosition {
  _ra: number;  // Right ascension in radians
  _dec: number; // Declination in radians
  range?: number; // Distance in kilometers (optional for compatibility)
}

/**
 * Calculates Julian Day number for given UTC date and time
 */
export function calculateJulianDay(utcDate: string, utcTime: string): number {
  // Validate input formats
  if (!/^\d{4}-\d{2}-\d{2}$/.test(utcDate)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(utcTime)) {
    throw new Error('Invalid time format. Expected HH:mm');
  }

  const [year, month, day] = utcDate.split('-').map(Number);
  const [hour, minute] = utcTime.split(':').map(Number);

  // Validate date components
  if (month < 1 || month > 12) throw new Error('Invalid month');
  if (day < 1 || day > 31) throw new Error('Invalid day');
  
  try {
    // Get JD for noon on the given date
    const jdNoon = CalendarGregorianToJD(year, month, day);
    
    // Calculate hours since noon (positive after noon, negative before)
    const hoursSinceNoon = hour - 12 + minute / 60;
    
    // Calculate day fraction based on time
    const dayFraction = hoursSinceNoon >= 0 
      ? 1 + hoursSinceNoon / 24 
      : hoursSinceNoon / 24;
    
    const jd = jdNoon + dayFraction;

    console.log('Julian Day calculation:', {
      input: { utcDate, utcTime },
      components: { year, month, day, hour, minute },
      calculation: { jdNoon, hoursSinceNoon, dayFraction },
      result: jd
    });

    return jd;
  } catch (error) {
    console.error('Julian Day calculation error:', error);
    throw error; // Re-throw to maintain existing error handling
  }
}

/**
 * Calculates lunar parallax angle based on moon's distance
 */
export function calculateLunarParallax(moonDistance: number): number {
  if (moonDistance <= ASTRONOMICAL_CONSTANTS.EARTH_RADIUS_KM) {
    throw new Error('Moon distance cannot be less than Earth radius');
  }
  
  const parallax = Math.asin(ASTRONOMICAL_CONSTANTS.EARTH_RADIUS_KM / moonDistance);
  
  console.log('Lunar parallax calculation:', {
    moonDistance,
    earthRadius: ASTRONOMICAL_CONSTANTS.EARTH_RADIUS_KM,
    parallaxRadians: parallax,
    parallaxDegrees: rad2deg(parallax)
  });

  return parallax;
}

/**
 * Converts geographic latitude to geocentric latitude
 */
export function calculateGeocentricLatitude(geographicLat: number): number {
  if (geographicLat < -90 || geographicLat > 90) {
    throw new Error('Geographic latitude must be between -90 and 90 degrees');
  }

  const latRad = deg2rad(geographicLat);
  const geoLat = latRad - (ASTRONOMICAL_CONSTANTS.FLATTENING_FACTOR * Math.sin(2 * latRad));

  console.log('Geocentric latitude calculation:', {
    geographicLatDeg: geographicLat,
    geographicLatRad: latRad,
    geocentricLatRad: geoLat,
    geocentricLatDeg: rad2deg(geoLat)
  });

  return geoLat;
}

/**
 * Calculates moon's ecliptic longitude from its equatorial coordinates
 */
export function calculateMoonLongitude(moonPos: CelestialPosition, epsRad: number): number {
  // Input validation
  if (!moonPos._ra || !moonPos._dec) {
    throw new Error('Invalid moon position: missing right ascension or declination');
  }
  if (epsRad < 0 || epsRad > Math.PI) {
    throw new Error('Invalid obliquity value');
  }

  // Compute ecliptic coordinates
  const sinLambda = Math.sin(moonPos._ra) * Math.cos(epsRad) + 
                    Math.tan(moonPos._dec) * Math.sin(epsRad);
  const cosLambda = Math.cos(moonPos._ra);
  
  // Calculate ecliptic longitude and normalize to [0, 2π)
  const lambdaRad = Math.atan2(sinLambda, cosLambda);
  const normalizedLambdaRad = normalizeRadians(lambdaRad);

  console.log('Moon longitude calculation:', {
    input: {
      rightAscension: moonPos._ra,
      declination: moonPos._dec,
      obliquity: epsRad
    },
    intermediate: {
      sinLambda,
      cosLambda,
      lambdaRad
    },
    result: {
      longitudeRad: normalizedLambdaRad,
      longitudeDeg: rad2deg(normalizedLambdaRad)
    }
  });

  return normalizedLambdaRad;
}

/**
 * Converts degrees to radians
 */
export function deg2rad(degrees: number): number {
  return degrees * ASTRONOMICAL_CONSTANTS.DEG_TO_RAD;
}

/**
 * Converts radians to degrees
 */
export function rad2deg(radians: number): number {
  return radians * ASTRONOMICAL_CONSTANTS.RAD_TO_DEG;
}

/**
 * Normalizes angle in degrees to range [0, 360)
 */
export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

/**
 * Normalizes angle in radians to range [0, 2π)
 */
export function normalizeRadians(radians: number): number {
  return ((radians % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

// Export types for external use
export type ZodiacSign = typeof ZODIAC_SIGNS[number];
export type { CelestialPosition };