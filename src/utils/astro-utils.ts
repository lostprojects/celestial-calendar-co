import moment from 'moment-timezone';
import * as solar from "astronomia/solar";
import * as sidereal from "astronomia/sidereal";
import * as nutation from "astronomia/nutation";
import * as deltat from "astronomia/deltat";
import { position as getMoonPosition } from "astronomia/moonposition";
import {
  calculateJulianDay,
  calculateLunarParallax,
  calculateGeocentricLatitude,
  calculateMoonLongitude,
  calculateObliquity,
  ZODIAC_SIGNS,
  deg2rad,
  rad2deg,
  normalizeDegrees
} from './astro/core';
import type { BirthChartData, BirthChartResult, AstronomicalConstants } from './astro/types';

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateInput(data: BirthChartData): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
    throw new ValidationError('Birth date must be in YYYY-MM-DD format');
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.birthTime)) {
    throw new ValidationError('Birth time must be in HH:mm format (24-hour)');
  }
  if (data.latitude < -90 || data.latitude > 90) {
    throw new ValidationError('Latitude must be between -90 and 90 degrees');
  }
  if (data.longitude < -180 || data.longitude > 180) {
    throw new ValidationError('Longitude must be between -180 and 180 degrees');
  }
}

function determineTimezone(latitude: number, longitude: number, providedTimezone?: string): string {
  if (providedTimezone && moment.tz.zone(providedTimezone)) {
    return providedTimezone;
  }

  if (Math.abs(latitude) > 75) {
    return 'UTC';
  }

  try {
    const tzNames = moment.tz.names();
    let nearestTz = 'UTC';
    let minDist = Infinity;

    for (const tz of tzNames) {
      const zone = moment.tz.zone(tz);
      if (!zone) continue;

      // Calculate distance using simplified formula
      const zoneLat = 0; // Default to 0 since MomentZone doesn't have lat/long
      const zoneLong = 0;
      const dist = Math.sqrt(
        Math.pow(latitude - zoneLat, 2) + 
        Math.pow(longitude - zoneLong, 2)
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
    nutationObl: nutObl
  };
  
  const sunLongRad = solar.apparentLongitude(jde);
  const sunLong = normalizeDegrees(rad2deg(sunLongRad));
  
  const moonPos = getMoonPosition(jde);
  const topoMoonPos = {
    _ra: moonPos._ra,
    _dec: moonPos._dec,
    range: moonPos.range
  };
  
  const moonLongRad = calculateMoonLongitude(topoMoonPos, constants.obliquity);
  const moonLong = normalizeDegrees(rad2deg(moonLongRad));
  
  const gst = sidereal.apparent(jde);
  const lst = (gst + data.longitude/15) % 24;
  const lstDeg = lst * 15;
  
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
  
  const sunPosition = getZodiacPosition(sunLong);
  const moonPosition = getZodiacPosition(moonLong);
  const ascPosition = getZodiacPosition(lstDeg);

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