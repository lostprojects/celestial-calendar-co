import moment from 'moment-timezone';
import { position as getMoonPosition } from "astronomia/moonposition";
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
  normalizeDegrees,
  calculateMeanSolarLongitude
} from './astro-core';

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
  return lng >= -12 && lng <= 0 && lat >= 35 && lat <= 60 ? 'Europe/London' :
         lng >= 0 && lng <= 20 && lat >= 35 && lat <= 60 ? 'Europe/Paris' :
         lng >= -180 && lng <= -50 && lat >= 24 && lat <= 50 ? 'America/New_York' :
         lng >= 100 && lng <= 145 && lat >= -45 && lat <= -10 ? 'Australia/Sydney' :
         'UTC';
}

export function calculateBirthChart(data: BirthChartData): BirthChartResult {
  const timezone = findTimezoneFromCoords(data.latitude, data.longitude);

  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone);
  const utcMoment = localMoment.utc();

  const jd = calculateJulianDay(utcMoment.format("YYYY-MM-DD"), utcMoment.format("HH:mm"));
  const deltaT = calculateDeltaT(jd);
  const jde = jd + deltaT / 86400;
  const eot = calculateEquationOfTime(jde);

  const meanLongitude = calculateMeanSolarLongitude(jde);
  const nutationCorr = nutation.nutation(jde).deltaPsi;
  const sunLongRad = deg2rad(meanLongitude + nutationCorr);
  const normalizedSunLong = normalizeDegrees(rad2deg(sunLongRad));

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

  const sunPosition = getZodiacPosition(normalizedSunLong);
  const moonLongitude = calculateMoonLongitude(topoMoonPos, deg2rad(23.4392911));
  const moonPosition = getZodiacPosition(rad2deg(moonLongitude));
  const ascendant = calculateAscendant(lst, data.latitude);
  const ascendantPosition = getZodiacPosition(ascendant);

  return {
    sunSign: sunPosition.sign,
    moonSign: moonPosition.sign,
    risingSign: ascendantPosition.sign,
    sunDeg: sunPosition.degrees,
    sunMin: sunPosition.minutes,
    moonDeg: moonPosition.degrees,
    moonMin: moonPosition.minutes,
    risingDeg: ascendantPosition.degrees,
    risingMin: ascendantPosition.minutes
  };
}

function getZodiacPosition(longitude: number) {
  const signIndex = Math.floor(longitude / 30);
  const totalDegrees = longitude % 30;
  const degrees = Math.floor(totalDegrees);
  const minutes = Math.floor((totalDegrees - degrees) * 60);
  
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degrees,
    minutes
  };
}

function calculateAscendant(lst: number, latitude: number): number {
  const obliquity = 23.4392911;
  const ascRad = Math.atan2(
    Math.cos(lst),
    -(Math.sin(lst) * Math.cos(deg2rad(obliquity)) + 
      Math.tan(deg2rad(latitude)) * Math.sin(deg2rad(obliquity)))
  );
  return normalizeDegrees(rad2deg(ascRad));
}