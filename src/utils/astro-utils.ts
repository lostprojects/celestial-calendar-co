import moment from 'moment-timezone';
import { position as getMoonPosition } from "astronomia/moonposition";
import * as solar from "astronomia/solar";
import * as sidereal from "astronomia/sidereal";
import * as nutation from "astronomia/nutation";
import {
  ZODIAC_SIGNS,
  calculateJulianDay,
  calculateDeltaT,
  calculateEquationOfTime,
  calculateLunarParallax,
  calculateGeocentricLatitude,
  calculateMoonLongitude,
  deg2rad,
  rad2deg,
  normalizeDegrees
} from './astro-core';

import { logAstroUtils, AstroEvent } from '@/logging/astro/utils-logging';

export interface BirthChartData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
}

export interface BirthChartResult {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  sunDeg: number;
  sunMin: number;
  moonDeg: number;
  moonMin: number;
  risingDeg: number;
  risingMin: number;
}

function findTimezoneFromCoords(lat: number, lng: number) {
  const timezone = lng >= -12 && lng <= 0 && lat >= 35 && lat <= 60 ? 'Europe/London' :
                   lng >= 0 && lng <= 20 && lat >= 35 && lat <= 60 ? 'Europe/Paris' :
                   lng >= -180 && lng <= -50 && lat >= 24 && lat <= 50 ? 'America/New_York' :
                   lng >= 100 && lng <= 145 && lat >= -45 && lat <= -10 ? 'Australia/Sydney' :
                   'UTC';

  logAstroUtils({
    event: 'TIMEZONE_DETECTION',
    inputs: { latitude: lat, longitude: lng },
    outputs: { detectedTimezone: timezone },
    timestamp: new Date().toISOString()
  });

  return timezone;
}

export function calculateBirthChart(data: BirthChartData): BirthChartResult {
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  logAstroUtils({
    event: 'TIME_INPUT_PROCESSING',
    inputs: {
      date: data.birthDate,
      time: data.birthTime,
      place: data.birthPlace,
      coordinates: { lat: data.latitude, lng: data.longitude }
    },
    timestamp: new Date().toISOString()
  });

  const timezone = findTimezoneFromCoords(data.latitude, data.longitude);
  const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone);
  const utcMoment = localMoment.utc();
  
  logAstroUtils({
    event: 'TIME_CONVERSION',
    inputs: { localDateTime: localMoment.format() },
    outputs: { 
      utcDateTime: utcMoment.format(),
      offset: localMoment.format("Z"),
      isDST: localMoment.isDST()
    },
    timestamp: new Date().toISOString()
  });

  const jd = calculateJulianDay(
    utcMoment.format("YYYY-MM-DD"),
    utcMoment.format("HH:mm")
  );
  
  const deltaT = calculateDeltaT(jd);
  const jde = jd + deltaT / 86400;
  const eot = calculateEquationOfTime(jde);
  
  logAstroUtils({
    event: 'JULIAN_CALCULATIONS',
    inputs: { utcDateTime: utcMoment.format() },
    outputs: { julianDay: jd, deltaT, julianEphemerisDay: jde, equationOfTime: eot },
    timestamp: new Date().toISOString()
  });

  const eps = 23.4392911;
  const epsRad = deg2rad(eps);

  const meanLongitude = solar.meanLongitude(jde);
  const nutationCorr = nutation.nutation(jde).deltaPsi;
  const sunLongRad = solar.apparentLongitude(jde);
  
  logAstroUtils({
    event: 'SOLAR_COMPONENTS',
    outputs: {
      meanLongitudeDeg: rad2deg(meanLongitude),
      apparentLongitudeDeg: rad2deg(sunLongRad),
      nutationCorrectionDeg: rad2deg(nutationCorr),
      obliquity: eps
    },
    timestamp: new Date().toISOString()
  });

  let normalizedSunLong = rad2deg(sunLongRad);
  normalizedSunLong = ((normalizedSunLong % 360) + 360) % 360;
  
  logAstroUtils({
    event: 'SUN_POSITION',
    intermediateSteps: {
      longitudeRadians: sunLongRad,
      longitudeDegrees: normalizedSunLong
    },
    outputs: { normalizedDegrees: normalizedSunLong },
    timestamp: new Date().toISOString()
  });

  const moonPos = getMoonPosition(jde);
  const moonDistance = moonPos.range;
  const parallax = calculateLunarParallax(moonDistance);
  const geoLat = calculateGeocentricLatitude(data.latitude);
  const lst = sidereal.apparent(jde);
  const hourAngle = lst - moonPos._ra;
  const deltaRA = -parallax * Math.cos(hourAngle) / Math.cos(moonPos._dec);
  const deltaDec = -parallax * Math.sin(hourAngle) * Math.sin(geoLat);
  const topoMoonPos = {
    _ra: moonPos._ra + deltaRA,
    _dec: moonPos._dec + deltaDec
  };
  
  logAstroUtils({
    event: 'MOON_CALCULATIONS',
    intermediateSteps: {
      distance: moonDistance,
      parallax,
      geocentricLatitude: geoLat,
      localSiderealTime: lst,
      hourAngle,
      deltaRightAscension: deltaRA,
      deltaDeclination: deltaDec
    },
    outputs: { topocentricPosition: topoMoonPos },
    timestamp: new Date().toISOString()
  });

  const moonLongRad = calculateMoonLongitude(topoMoonPos, epsRad);
  const finalMoonLongitude = rad2deg(moonLongRad);

  const gst = sidereal.apparent(jde) % 24;
  const localSiderealTime = gst + data.longitude/15;
  const localSiderealDeg = localSiderealTime * 15;
  const localSiderealRad = deg2rad(localSiderealDeg);
  
  logAstroUtils({
    event: 'COORDINATE_CALCULATIONS',
    inputs: {
      latitude: data.latitude,
      longitude: data.longitude
    },
    outputs: {
      geocentricLatitude: geoLat,
      localSiderealTime
    },
    timestamp: new Date().toISOString()
  });
  
  const latRad = deg2rad(data.latitude);
  const y = Math.cos(localSiderealRad);
  const x = Math.sin(localSiderealRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  let ascendant = rad2deg(Math.atan2(x, y));
  ascendant = normalizeDegrees(ascendant);

  const sunPosition = getZodiacPosition(normalizedSunLong);
  const moonPosition = getZodiacPosition(finalMoonLongitude);
  const ascPosition = getZodiacPosition(ascendant);

  logAstroUtils({
    event: 'FINAL_POSITIONS',
    outputs: {
      sun: sunPosition,
      moon: moonPosition,
      ascendant: ascPosition
    },
    timestamp: new Date().toISOString()
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

function getZodiacPosition(longitude: number) {
  const signIndex = Math.floor(longitude / 30);
  const totalDegrees = longitude % 30;
  const degrees = Math.floor(totalDegrees);
  const minutes = Math.floor((totalDegrees - degrees) * 60);
  
  const result = {
    sign: ZODIAC_SIGNS[signIndex],
    degrees,
    minutes
  };

  logAstroUtils({
    event: 'ZODIAC_POSITION',
    inputs: { longitude },
    intermediateSteps: {
      signIndex,
      totalDegrees,
      degrees,
      minutes
    },
    outputs: result,
    timestamp: new Date().toISOString()
  });
  
  return result;
}