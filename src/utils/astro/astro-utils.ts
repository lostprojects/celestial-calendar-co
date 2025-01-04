import moment from 'moment-timezone';
import * as solar from "astronomia/solar";
import * as sidereal from "astronomia/sidereal";
import * as nutation from "astronomia/nutation";
import * as deltat from "astronomia/deltat";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as refraction from "astronomia/refraction";
import * as parallax from "astronomia/parallax";
import { logger } from "../../lib/logger";

import {
  calculateJulianDay,
  calculateMoonLongitude,
  calculateObliquity,
  ZODIAC_SIGNS,
  deg2rad,
  rad2deg,
  normalizeDegrees
} from './core';

import type { 
  BirthChartData, 
  BirthChartResult, 
  AstronomicalConstants,
  CelestialPosition
} from './types';

export type { BirthChartData, BirthChartResult };

export function calculateBirthChart(data: BirthChartData): BirthChartResult {
  validateInput(data);
  
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  logger.debug("Processing birth chart for", {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
    place: data.birthPlace,
    lat: data.latitude,
    lng: data.longitude
  });
  
  const timezone = determineTimezone(data.latitude, data.longitude, data.timezone);
  const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone);
  const utcMoment = localMoment.utc();
  
  const jd = calculateJulianDay(
    utcMoment.format("YYYY-MM-DD"),
    utcMoment.format("HH:mm")
  );
  
  const deltaT = deltat.deltaT(jd);
  const jde = jd + deltaT / 86400;
  
  const obliquity = calculateObliquity(jde);
  const [nutLong, nutObl] = nutation.nutation(jde);
  
  const constants: AstronomicalConstants = {
    obliquity: obliquity + nutObl,
    nutationLong: nutLong,
    nutationObl: nutObl,
    jde,
    deltaT
  };
  
  // Calculate apparent solar position
  const sunLongRad = solar.apparentLongitude(jde);
  const sunLongDeg = rad2deg(sunLongRad);
  const sunLong = normalizeDegrees(sunLongDeg);
  
  // Calculate lunar position with parallax correction
  const moonPos = getMoonPosition(jde);
  const parallaxCorr = parallax.horizontal(moonPos.range, data.latitude);
  
  const topoMoonPos = {
    _ra: moonPos._ra,
    _dec: moonPos._dec - deg2rad(parallaxCorr),
    range: moonPos.range
  };
  
  const moonLongRad = calculateMoonLongitude(topoMoonPos, constants.obliquity);
  const moonLong = normalizeDegrees(rad2deg(moonLongRad));
  
  // Calculate sidereal time and local sidereal time
  const gst = sidereal.apparent(jde);
  const lst = (gst + data.longitude/15) % 24;
  const lstDeg = lst * 15;
  
  // Apply refraction correction
  const altitudeCorrection = refraction.bennett2(deg2rad(lstDeg));
  const correctedLstDeg = lstDeg + rad2deg(altitudeCorrection);

  function getZodiacPosition(longitude: number) {
    const normalized = normalizeDegrees(longitude);
    logger.debug("Calculating zodiac position", {
      rawLongitude: longitude,
      normalized
    });
    
    const signIndex = Math.floor(normalized / 30);
    const totalDegrees = normalized % 30;
    const degrees = Math.floor(totalDegrees);
    const minutes = Math.floor((totalDegrees - degrees) * 60);
    
    return {
      sign: ZODIAC_SIGNS[signIndex],
      degrees,
      minutes,
      absoluteDegrees: normalized
    };
  }
  
  const sunPosition = getZodiacPosition(sunLong);
  const moonPosition = getZodiacPosition(moonLong);
  const ascPosition = getZodiacPosition(correctedLstDeg);

  const result = {
    sunSign: sunPosition.sign,
    moonSign: moonPosition.sign,
    risingSign: ascPosition.sign,
    sunDeg: sunPosition.degrees,
    sunMin: sunPosition.minutes,
    moonDeg: moonPosition.degrees,
    moonMin: moonPosition.minutes,
    risingDeg: ascPosition.degrees,
    risingMin: ascPosition.minutes,
    absolutePositions: {
      sun: sunPosition.absoluteDegrees,
      moon: moonPosition.absoluteDegrees,
      ascending: ascPosition.absoluteDegrees
    },
    calculation: {
      jde,
      deltaT,
      obliquity: constants.obliquity,
      nutationLong: constants.nutationLong,
      nutationObl: constants.nutationObl
    }
  };

  logger.debug("Final calculation result", result);
  return result;
}

class AstronomicalError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'AstronomicalError';
  }
}

function validateInput(data: BirthChartData): void {
  const currentYear = new Date().getFullYear();
  const [year, month, day] = data.birthDate.split("-").map(Number);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
    throw new AstronomicalError('Birth date must be in YYYY-MM-DD format', 'INVALID_DATE_FORMAT');
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.birthTime)) {
    throw new AstronomicalError('Birth time must be in HH:mm format (24-hour)', 'INVALID_TIME_FORMAT');
  }
  if (data.latitude < -90 || data.latitude > 90) {
    throw new AstronomicalError('Latitude must be between -90 and 90 degrees', 'INVALID_LATITUDE');
  }
  if (data.longitude < -180 || data.longitude > 180) {
    throw new AstronomicalError('Longitude must be between -180 and 180 degrees', 'INVALID_LONGITUDE');
  }
  if (year < 1800 || year > currentYear) {
    throw new AstronomicalError('Birth year must be between 1800 and present', 'INVALID_YEAR_RANGE');
  }

  // Validate polar regions
  const ARCTIC_CIRCLE = 66.5;
  const isPolarRegion = Math.abs(data.latitude) > ARCTIC_CIRCLE;
  
  if (isPolarRegion) {
    // Calculate if it's polar day or night
    const jd = calculateJulianDay(data.birthDate, data.birthTime);
    const sunPos = solar.apparentLongitude(jd);
    const declinationRad = Math.asin(Math.sin(sunPos) * Math.sin(deg2rad(23.4)));
    const declination = rad2deg(declinationRad);
    
    // For polar regions, check if the sun is visible
    const sunAltitude = 90 - Math.abs(data.latitude) + declination;
    
    if (sunAltitude < -6) { // Civil twilight threshold
      throw new AstronomicalError(
        'Birth time occurs during polar night when the sun is not visible. ' +
        'This may affect the accuracy of astronomical calculations. ' +
        'Please verify the date and location.',
        'POLAR_NIGHT'
      );
    }
    
    logger.warn('Calculating birth chart for polar region', {
      latitude: data.latitude,
      sunAltitude,
      date: data.birthDate
    });
  }
}

function determineTimezone(latitude: number, longitude: number, providedTimezone?: string): string {
  // If a valid timezone is provided, use it
  if (providedTimezone && moment.tz.zone(providedTimezone)) {
    return providedTimezone;
  }

  try {
    // Get all timezone names
    const timezones = moment.tz.names();
    let closestZone = 'UTC';
    let minDistance = Infinity;

    // Find the closest timezone based on coordinates
    for (const zone of timezones) {
      const tz = moment.tz.zone(zone);
      if (!tz) continue;

      // Get timezone coordinates (if available)
      const tzCoords = getTimezoneCoordinates(zone);
      if (!tzCoords) continue;

      // Calculate distance using Haversine formula
      const distance = haversineDistance(
        latitude,
        longitude,
        tzCoords.latitude,
        tzCoords.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestZone = zone;
      }
    }

    // Verify the timezone handles DST correctly for the given coordinates
    const tz = moment.tz.zone(closestZone);
    if (!tz) {
      throw new Error('Invalid timezone');
    }

    // Check if the timezone's offset matches expected offset for the coordinates
    const now = moment();
    const expectedOffset = -Math.round(longitude / 15) * 60;
    const actualOffset = tz.utcOffset(now.valueOf());
    
    // If offset difference is more than 2 hours, fall back to UTC
    if (Math.abs(expectedOffset - actualOffset) > 120) {
      logger.warn('Timezone offset mismatch, falling back to UTC', {
        timezone: closestZone,
        expectedOffset,
        actualOffset
      });
      return 'UTC';
    }

    return closestZone;
  } catch (error) {
    logger.warn('Timezone determination failed, falling back to UTC', { error });
    return 'UTC';
  }
}

// Helper function to get timezone coordinates from tzdb
function getTimezoneCoordinates(zone: string): { latitude: number; longitude: number } | null {
  try {
    const tz = moment.tz.zone(zone);
    if (!tz) return null;

    // Parse coordinates from zone name (if available)
    const coords = tz.name.split('/').pop()?.match(/([+-]\d+)([+-]\d+)/);
    if (!coords) return null;

    return {
      latitude: parseInt(coords[1]) / 100,
      longitude: parseInt(coords[2]) / 100
    };
  } catch {
    return null;
  }
}

// Calculate distance between two points using Haversine formula
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
