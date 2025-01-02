import moment from 'moment-timezone';
import * as solar from "astronomia/solar";
import * as sidereal from "astronomia/sidereal";
import * as nutation from "astronomia/nutation";
import * as deltat from "astronomia/deltat";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as refraction from "astronomia/refraction";
import * as parallax from "astronomia/parallax";

import {
  calculateJulianDay,
  calculateMoonLongitude,
  calculateObliquity,
  ZODIAC_SIGNS,
  deg2rad,
  rad2deg,
  normalizeDegrees
} from './astro/core';

import type { 
  BirthChartData, 
  BirthChartResult, 
  AstronomicalConstants,
  CelestialPosition
} from './astro/types';

export type { BirthChartData, BirthChartResult };

export function calculateBirthChart(data: BirthChartData): BirthChartResult {
  validateInput(data);
  
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  console.log("Processing birth chart for:", {
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
  
  // Calculate apparent solar position with proper conversion from radians to degrees
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
    // Ensure proper normalization of the longitude
    const normalized = normalizeDegrees(longitude);
    console.log(`Raw longitude: ${longitude}, Normalized: ${normalized}`);
    
    // Calculate zodiac sign index (0-11)
    const signIndex = Math.floor(normalized / 30);
    console.log(`Sign index: ${signIndex}, Sign: ${ZODIAC_SIGNS[signIndex]}`);
    
    // Calculate degrees and minutes within the sign
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
  
  // Calculate positions with additional logging
  console.log("Raw sun longitude:", rad2deg(sunLongRad));
  const sunPosition = getZodiacPosition(sunLong);
  console.log("Sun position:", sunPosition);
  
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

  console.log("Final calculation result:", result);
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
  const [year] = data.birthDate.split("-").map(Number);

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
}

function determineTimezone(latitude: number, longitude: number, providedTimezone?: string): string {
  if (providedTimezone && moment.tz.zone(providedTimezone)) {
    return providedTimezone;
  }

  if (Math.abs(latitude) > 75) {
    const timezoneLong = Math.round(longitude / 15) * 15;
    return `Etc/GMT${timezoneLong >= 0 ? '-' : '+'}${Math.abs(Math.round(longitude / 15))}`;
  }

  try {
    const hourOffset = Math.round(longitude / 15);
    return `Etc/GMT${hourOffset >= 0 ? '-' : '+'}${Math.abs(hourOffset)}`;
  } catch (error) {
    console.warn('Timezone determination failed, falling back to UTC');
    return 'UTC';
  }
}
