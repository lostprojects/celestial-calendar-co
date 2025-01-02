import moment from 'moment-timezone';
import { position as getMoonPosition } from "astronomia/moonposition";
import * as solar from "astronomia/solar";
import * as sidereal from "astronomia/sidereal";
import * as nutation from "astronomia/nutation";
import * as deltat from "astronomia/deltat";
import {
  ZODIAC_SIGNS,
  calculateJulianDay,
  calculateLunarParallax,
  calculateGeocentricLatitude,
  calculateMoonLongitude,
  deg2rad,
  rad2deg,
  normalizeDegrees
} from './astro-core';

// Type definitions with documentation
export interface BirthChartData {
  /** Birth date in YYYY-MM-DD format */
  birthDate: string;
  /** Birth time in HH:mm format (24-hour) */
  birthTime: string;
  /** Location name or description */
  birthPlace: string;
  /** Geographical latitude in decimal degrees (positive for North) */
  latitude: number;
  /** Geographical longitude in decimal degrees (positive for East) */
  longitude: number;
  /** Timezone identifier (e.g., 'America/New_York') */
  timezone?: string;
  /** UTC offset in minutes */
  utc_offset?: number;
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates input data for birth chart calculation
 * @throws {ValidationError} If any validation fails
 */
function validateInput(data: BirthChartData): void {
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
    throw new ValidationError('Birth date must be in YYYY-MM-DD format');
  }

  // Validate time format
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.birthTime)) {
    throw new ValidationError('Birth time must be in HH:mm format (24-hour)');
  }

  // Validate coordinates
  if (data.latitude < -90 || data.latitude > 90) {
    throw new ValidationError('Latitude must be between -90 and 90 degrees');
  }
  if (data.longitude < -180 || data.longitude > 180) {
    throw new ValidationError('Longitude must be between -180 and 180 degrees');
  }
}

/**
 * Determines timezone from coordinates if not provided
 * Uses UTC for polar regions where normal timezone rules might not apply
 */
function determineTimezone(latitude: number, longitude: number, providedTimezone?: string): string {
  if (providedTimezone) {
    if (!moment.tz.zone(providedTimezone)) {
      throw new ValidationError(`Invalid timezone: ${providedTimezone}`);
    }
    return providedTimezone;
  }

  // For extreme latitudes, use UTC
  if (Math.abs(latitude) > 75) {
    return 'UTC';
  }

  try {
    // Use moment-timezone to find the timezone from coordinates
    const tzNames = moment.tz.names();
    let nearestTz = 'UTC';
    let minDist = Infinity;

    for (const tz of tzNames) {
      const zone = moment.tz.zone(tz);
      if (!zone) continue;

      // Get timezone coordinates (if available)
      const tzCoords = zone.lat && zone.long ? { lat: zone.lat, long: zone.long } : null;
      if (!tzCoords) continue;

      // Calculate distance using haversine formula
      const dist = Math.sqrt(
        Math.pow(latitude - tzCoords.lat, 2) + 
        Math.pow(longitude - tzCoords.long, 2)
      );

      if (dist < minDist) {
        minDist = dist;
        nearestTz = tz;
      }
    }

    return nearestTz;
  } catch (error) {
    console.warn('Timezone determination failed, falling back to UTC', error);
    return 'UTC';
  }
}

/**
 * Calculates astronomical constants for a given Julian Day
 */
function calculateAstronomicalConstants(jd: number): AstronomicalConstants {
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
  
  // Calculate true obliquity
  const eps = nutation.meanObliquity(jd);
  const [nutLong, nutObl] = nutation.nutation(jd);

  return {
    obliquity: eps + nutObl,
    nutationLong: nutLong,
    nutationObl: nutObl
  };
}

/**
 * Calculates Equation of Time with high precision
 */
function calculateEOT(jd: number, deltaT: number): number {
  const jde = jd + deltaT / 86400;
  const L0 = solar.meanLongitude(jde);
  const M = solar.meanAnomaly(jde);
  const e = solar.eccentricity(jde);
  const C = e * Math.sin(M) + 
           (5/4) * e * e * Math.sin(2 * M) +
           (13/12) * e * e * e * Math.sin(3 * M);
  
  const eps = nutation.meanObliquity(jde);
  const [nutLong] = nutation.nutation(jde);
  
  // Calculate EOT components
  const R = C;
  const S = nutLong * Math.cos(eps);
  
  const EOT = (L0 - rad2deg(R) - 0.0057183 - rad2deg(S)) * 4;
  
  console.log("EOT calculation details:", {
    meanLongitude: rad2deg(L0),
    meanAnomaly: rad2deg(M),
    eccentricity: e,
    equationCenter: rad2deg(C),
    obliquity: rad2deg(eps),
    nutationLong: rad2deg(nutLong),
    eot: EOT
  });
  
  return EOT;
}

/**
 * Calculates accurate topocentric moon position
 */
function calculateTopocentricMoon(jde: number, geoLat: number, moonPos: any) {
  const moonDistance = moonPos.range;
  const parallax = calculateLunarParallax(moonDistance);
  const geoLatRad = calculateGeocentricLatitude(geoLat);
  const lst = sidereal.apparent(jde);
  const hourAngle = lst - moonPos._ra;
  
  // Calculate topocentric corrections
  const deltaRA = -parallax * Math.cos(hourAngle) / Math.cos(moonPos._dec);
  const deltaDec = -parallax * Math.sin(hourAngle) * Math.sin(geoLatRad);
  
  // Apply corrections
  return {
    _ra: moonPos._ra + deltaRA,
    _dec: moonPos._dec + deltaDec,
    range: moonDistance,
    parallax,
    hourAngle
  };
}

/**
 * Calculates rising sign (ascendant) with high precision
 */
function calculateAscendant(jd: number, lat: number, lng: number, constants: AstronomicalConstants): number {
  const gst = sidereal.apparent(jd);
  const lst = (gst + lng/15) % 24;
  const lstDeg = lst * 15;
  const lstRad = deg2rad(lstDeg);
  
  const latRad = deg2rad(lat);
  const oblRad = constants.obliquity;
  
  // Calculate ascendant using more precise formula
  const F = 1/15 * rad2deg(Math.atan2(
    Math.cos(lstRad),
    -(Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad))
  ));
  
  return normalizeDegrees(F * 15);
}

/**
 * Converts ecliptic longitude to zodiac position
 */
function getZodiacPosition(longitude: number) {
  const normalized = normalizeDegrees(longitude);
  const signIndex = Math.floor(normalized / 30);
  const totalDegrees = normalized % 30;
  const degrees = Math.floor(totalDegrees);
  const minutes = Math.floor((totalDegrees - degrees) * 60);
  
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degrees,
    minutes
  };
}

/**
 * Main function to calculate birth chart
 * @throws {ValidationError} If input validation fails
 * @throws {Error} If calculation fails
 */
export function calculateBirthChart(data: BirthChartData): BirthChartResult {
  // Validate input
  validateInput(data);
  
  // Parse input data
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  console.log("Processing birth chart for:", {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
    place: data.birthPlace,
    lat: data.latitude,
    lng: data.longitude,
    timezone: data.timezone,
    utcOffset: data.utc_offset
  });

  // Use provided timezone or determine it
  let timezone = data.timezone;
  if (!timezone) {
    timezone = determineTimezone(data.latitude, data.longitude);
  }

  // Create moment with timezone
  const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone);
  const utcMoment = localMoment.utc();
  
  // Calculate Julian Day
  const jd = calculateJulianDay(
    utcMoment.format("YYYY-MM-DD"),
    utcMoment.format("HH:mm")
  );
  
  // Calculate ΔT (Delta T) for the date
  const deltaT = deltat.deltaT(jd);
  const jde = jd + deltaT / 86400;
  
  console.log("Time conversions:", {
    localTime: localMoment.format(),
    utcTime: utcMoment.format(),
    julianDay: jd,
    deltaT,
    julianEphemerisDay: jde
  });

  // Calculate astronomical constants
  const constants = calculateAstronomicalConstants(jde);
  
  // Calculate EOT correction
  const eot = calculateEOT(jd, deltaT);
  
  // Calculate apparent solar position
  const sunLongRad = solar.apparentLongitude(jde) + deg2rad(eot / 240);
  const sunLong = normalizeDegrees(rad2deg(sunLongRad));
  
  // Calculate precise lunar position
  const moonPos = getMoonPosition(jde);
  const topoMoonPos = calculateTopocentricMoon(jde, data.latitude, moonPos);
  const moonLongRad = calculateMoonLongitude(topoMoonPos, constants.obliquity);
  const moonLong = normalizeDegrees(rad2deg(moonLongRad));
  
  // Calculate ascendant
  const ascendant = calculateAscendant(jde, data.latitude, data.longitude, constants);
  
  // Convert to zodiac positions
  const sunPosition = getZodiacPosition(sunLong);
  const moonPosition = getZodiacPosition(moonLong);
  const ascPosition = getZodiacPosition(ascendant);
  
  console.log("Final calculations:", {
    sun: { longitude: sunLong, ...sunPosition },
    moon: { longitude: moonLong, ...moonPosition },
    ascendant: { longitude: ascendant, ...ascPosition }
  });

  return {
    sunSign: sunPosition.sign,
    moonSign: moonPosition.sign,
    risingSign: ascPosition.sign,
    sunDeg: sunPosition.degrees,
    sunMin: sunPosition.minutes,
    moonDeg: moonPosition.degrees,
    moonMin: moonPosition.minutes,
    risingDeg: ascPosition.degrees,
    risingMin: ascPosition.minutes
  };
}
