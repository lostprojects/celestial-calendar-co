import { CalendarGregorianToJD } from "astronomia/julian";
import * as solar from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as sidereal from "astronomia/sidereal";
import { CelestialPosition } from './types';

/**
 * Fundamental astronomical constants
 * Only including constants we can verify from the library or calculate
 */
export const ASTRONOMICAL_CONSTANTS = {
    // WGS84 reference ellipsoid constants (verified)
    EARTH_F: 1/298.257223563,
    EARTH_RADIUS_EQ: 6378137.0, // meters
    EARTH_RADIUS_POLAR: 6356752.3142, // meters
    C: 299792458 // Speed of light in m/s
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
 * Calculates Julian Day number
 * Uses verified Gregorian calendar conversion from astronomia/julian
 */
export function calculateJulianDay(utcDate: string, utcTime: string): number {
    const [year, month, day] = utcDate.split('-').map(Number);
    const [hour, minute, second = 0] = utcTime.split(':').map(Number);
    
    // Convert time to decimal hours with subsecond precision
    const decimalHours = hour + minute/60 + second/3600;
    
    // Calculate Julian Day for 0h using astronomia's verified function
    const jd0h = CalendarGregorianToJD(year, month, day);
    
    // Add time fraction with standard precision
    const fraction = (decimalHours - 12)/24;
    
    return jd0h + fraction;
}

/**
 * Calculate geocentric latitude using verified WGS84 parameters
 * Uses first-order approximation sufficient for astrological purposes
 */
export function calculateGeocentricLatitude(geographicLat: number): number {
    const f = ASTRONOMICAL_CONSTANTS.EARTH_F;
    const latRad = deg2rad(geographicLat);
    
    // First-order approximation
    const sin2Lat = Math.sin(2 * latRad);
    return latRad - f * sin2Lat * (1 - f/4);
}

/**
 * Calculate moon longitude using available moonposition function
 */
export function calculateMoonLongitude(moonPos: CelestialPosition, epsRad: number): number {
    const { _ra: ra, _dec: dec } = moonPos;
    
    // Standard calculation for ecliptic coordinates
    const sinLambda = Math.sin(ra) * Math.cos(epsRad) + 
                      Math.tan(dec) * Math.sin(epsRad);
    const cosLambda = Math.cos(ra);
    
    return normalizeRadians(Math.atan2(sinLambda, cosLambda));
}

/**
 * Calculate basic obliquity of the ecliptic
 * Using simplified model suitable for most purposes
 */
export function calculateObliquity(jd: number): number {
    // T is centuries since J2000.0
    const T = (jd - 2451545.0) / 36525;
    
    // Mean obliquity (truncated Laskar's formula)
    const eps0 = 23.43929111 - (46.8150 * T) / 3600;
    
    return deg2rad(eps0);
}

/**
 * Angle conversion utilities
 */
export function deg2rad(degrees: number): number {
    return degrees * Math.PI / 180;
}

export function rad2deg(radians: number): number {
    return radians * 180 / Math.PI;
}

/**
 * Normalize angles to standard ranges
 */
export function normalizeDegrees(degrees: number): number {
    return ((degrees % 360) + 360) % 360;
}

export function normalizeRadians(radians: number): number {
    const TWO_PI = 2 * Math.PI;
    return ((radians % TWO_PI) + TWO_PI) % TWO_PI;
}

export type ZodiacSign = typeof ZODIAC_SIGNS[number];