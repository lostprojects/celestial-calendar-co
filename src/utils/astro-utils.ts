import moment from 'moment-timezone';
import { position as getMoonPosition } from "astronomia/moonposition";
import * as solar from "astronomia/solar";
import * as sidereal from "astronomia/sidereal";
import { nutation } from "astronomia/nutation";
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

export function calculateBirthChart(data: BirthChartData): BirthChartResult {
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  console.log("Input data:", {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
    place: data.birthPlace,
    lat: data.latitude,
    lng: data.longitude
  });

  const localMoment = moment.tz([year, month - 1, day, hour, minute], "Europe/London");
  const utcMoment = localMoment.utc();
  
  const jd = calculateJulianDay(
    utcMoment.format("YYYY-MM-DD"),
    utcMoment.format("HH:mm")
  );
  
  const deltaT = 67.2;
  const jde = jd + deltaT / 86400;
  console.log("Julian Day:", jd);
  console.log("Julian Ephemeris Day:", jde);

  const T = (jd - 2451545.0) / 36525;
  const meanEps = 23.43929111 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  const meanEpsRad = deg2rad(meanEps);
  const { deltaObl } = nutation(T);
  const epsRad = meanEpsRad + deltaObl;

  // Sun calculation (keeping as is since it works)
  const sunLongRad = solar.apparentLongitude(jde);
  const sunLongDeg = rad2deg(sunLongRad);
  const normalizedSunLong = normalizeDegrees(sunLongDeg);
  
  // Fixed Moon calculation - properly accessing _ra and _dec
  const moonPos = getMoonPosition(jde);
  const moonLongRad = calculateMoonLongitude({ _ra: moonPos._ra, _dec: moonPos._dec }, epsRad);
  const moonLongDeg = rad2deg(moonLongRad);
  const normalizedMoonLong = normalizeDegrees(moonLongDeg);

  // Fixed Rising sign calculation
  let ramc = sidereal.apparent(jde);
  ramc = ramc % 24;
  if (ramc < 0) ramc += 24;
  ramc = (ramc + data.longitude / 15) % 24;
  if (ramc < 0) ramc += 24;
  
  const ramcDeg = ramc * 15;
  const ramcRad = deg2rad(ramcDeg);
  const geoLatRad = deg2rad(data.latitude);
  
  const numerator = -Math.cos(ramcRad);
  const denominator = Math.cos(epsRad) * Math.sin(ramcRad);
  const ascendant = normalizeDegrees(rad2deg(Math.atan2(numerator, denominator)));

  console.log("Calculation results:", {
    sun: normalizedSunLong,
    moon: normalizedMoonLong,
    asc: ascendant
  });

  const sunPosition = getZodiacPosition(normalizedSunLong);
  const moonPosition = getZodiacPosition(normalizedMoonLong);
  const ascPosition = getZodiacPosition(ascendant);

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
  
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degrees,
    minutes
  };
}
