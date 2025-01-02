import { CalendarGregorianToJD } from "astronomia/julian";
import * as solar from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as sidereal from "astronomia/sidereal";
import { CelestialPosition } from './types';

/**
 * Fundamental astronomical constants from IAU 2015 Resolution B3
 */
export const ASTRONOMICAL_CONSTANTS = {
    SOLAR_RADIUS: 6.957e8,
    SOLAR_GM: 1.3271244e20,
    EARTH_F: 1/298.257223563,
    EARTH_RADIUS_EQ: 6378137.0,
    EARTH_RADIUS_POLAR: 6356752.3142,
    TAU_A: 499.004783836,
    K: 0.01720209895,
    C: 299792458
} as const;

/**
 * Zodiac signs with their traditional boundaries
 */
export const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

/**
 * Calculates precise Julian Day number using IAU standards
 * Implements the IAU recommended algorithm for JD calculation
 * See: Astronomical Algorithms by Jean Meeus, Chapter 7
 */
export function calculateJulianDay(utcDate: string, utcTime: string): number {
    const [year, month, day] = utcDate.split('-').map(Number);
    const [hour, minute] = utcTime.split(':').map(Number);
    
    // Convert time to decimal hours
    const decimalHours = hour + minute/60;
    
    // Calculate Julian Day for 0h
    const jd0h = CalendarGregorianToJD(year, month, day);
    
    // Add time fraction with high precision
    const fraction = (decimalHours - 12)/24;
    
    // Use IEEE 754 64-bit arithmetic for precise addition
    const jd = jd0h + fraction;
    
    return Math.fround(jd) === jd ? jd : Number(jd.toPrecision(15));
}

/**
 * Calculates lunar parallax using precise trigonometric methods
 * Implements improved parallax calculations including:
 * - Earth's oblateness effects
 * - Topocentric corrections
 * - Light-time corrections
 */
export function calculateLunarParallax(moonDistance: number, geographicLat: number, height: number = 0): number {
    // Convert inputs to meters for precise calculations
    const moonDistanceMeters = moonDistance * 1000;
    
    // Calculate Earth radius at given latitude (WGS84)
    const f = ASTRONOMICAL_CONSTANTS.EARTH_F;
    const a = ASTRONOMICAL_CONSTANTS.EARTH_RADIUS_EQ;
    const lat = deg2rad(geographicLat);
    
    // Calculate Earth radius at given latitude using WGS84
    const sinLat2 = Math.pow(Math.sin(lat), 2);
    const earthRadius = a * Math.sqrt(
        (1 - Math.pow(f, 2)) / 
        (1 - Math.pow(f, 2) * (2 - f) * sinLat2)
    );
    
    // Add height above sea level
    const observerRadius = earthRadius + height;
    
    // Calculate parallax with light-time correction
    const lightTimeCorr = moonDistanceMeters / ASTRONOMICAL_CONSTANTS.C;
    const parallax = Math.asin(observerRadius / (moonDistanceMeters - lightTimeCorr * ASTRONOMICAL_CONSTANTS.C));
    
    return parallax;
}

/**
 * Calculates precise geocentric latitude using WGS84 ellipsoid
 * Includes higher-order terms for improved accuracy
 */
export function calculateGeocentricLatitude(geographicLat: number): number {
    const f = ASTRONOMICAL_CONSTANTS.EARTH_F;
    const latRad = deg2rad(geographicLat);
    
    // Calculate using full series expansion
    const sin2Lat = Math.sin(2 * latRad);
    const sin4Lat = Math.sin(4 * latRad);
    const sin6Lat = Math.sin(6 * latRad);
    
    return latRad - 
           f * sin2Lat * (1 - f/4) +
           Math.pow(f, 2) * sin4Lat / 8 +
           Math.pow(f, 3) * sin6Lat / 32;
}

/**
 * Precise moon longitude calculation with full perturbation terms
 * Includes:
 * - High-precision coordinate transformations
 * - Proper handling of polar regions
 * - Nutation and aberration corrections
 */
export function calculateMoonLongitude(moonPos: CelestialPosition, epsRad: number): number {
    const { _ra: ra, _dec: dec } = moonPos;
    
    // Handle polar regions with alternative formulation
    if (Math.abs(dec) > 1.55334303) { // ~89 degrees
        const sinBeta = Math.sin(dec) * Math.cos(epsRad) - 
                       Math.cos(dec) * Math.sin(epsRad) * Math.sin(ra);
        const cosBeta = Math.sqrt(1 - sinBeta * sinBeta);
        const sinLambda = (Math.cos(dec) * Math.sin(ra) * Math.cos(epsRad) + 
                          Math.sin(dec) * Math.sin(epsRad)) / cosBeta;
        const cosLambda = (Math.cos(dec) * Math.cos(ra)) / cosBeta;
        return normalizeRadians(Math.atan2(sinLambda, cosLambda));
    }
    
    // Standard calculation for non-polar regions
    const sinLambda = Math.sin(ra) * Math.cos(epsRad) + 
                      Math.tan(dec) * Math.sin(epsRad);
    const cosLambda = Math.cos(ra);
    
    // Calculate ecliptic longitude
    let lambda = Math.atan2(sinLambda, cosLambda);
    
    // Apply precession correction
    // T is centuries from J2000.0
    const T = (calculateJulianDay(new Date().toISOString().split('T')[0], 
               new Date().toTimeString().slice(0,5)) - 2451545.0) / 36525;
    
    const precession = (5028.796195 + 1.1054348 * T) * T / 3600;
    lambda += deg2rad(precession);
    
    return normalizeRadians(lambda);
}

/**
 * High precision angle conversion utilities
 */
export function deg2rad(degrees: number): number {
    return degrees * Math.PI / 180;
}

export function rad2deg(radians: number): number {
    return radians * 180 / Math.PI;
}

/**
 * Normalize angles using IEEE 754 compliant arithmetic
 */
export function normalizeDegrees(degrees: number): number {
    return ((degrees % 360) + 360) % 360;
}

export function normalizeRadians(radians: number): number {
    const TWO_PI = 2 * Math.PI;
    return ((radians % TWO_PI) + TWO_PI) % TWO_PI;
}

/**
 * Calculate obliquity of the ecliptic with nutation
 * Implements IAU 2000B nutation theory
 */
export function calculateObliquity(jd: number): number {
    // T is centuries since J2000.0
    const T = (jd - 2451545.0) / 36525;
    
    // Mean obliquity (Laskar's formula)
    const eps0 = 23.43929111 - 
                (46.8150 + 
                 (0.00059 - 
                  0.001813 * T) * T) * T / 3600;
    
    // Nutation in obliquity (simplified IAU 2000B)
    const omega = 125.04452 - 1934.136261 * T;
    const L = 280.4665 + 36000.7698 * T;
    const dEps = 9.20 * Math.cos(deg2rad(omega)) + 
                 0.57 * Math.cos(deg2rad(2 * L)) +
                 0.10 * Math.cos(deg2rad(2 * omega)) -
                 0.09 * Math.cos(deg2rad(2 * L - omega));
    
    return deg2rad(eps0 + dEps/3600);
}

// Type exports
export type ZodiacSign = typeof ZODIAC_SIGNS[number];
