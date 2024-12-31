import moment from 'moment-timezone';
import { position as getMoonPosition } from "astronomia/moonposition";
import * as solar from "astronomia/solar";
import * as sidereal from "astronomia/sidereal";
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

  // Convert local time to UTC using moment-timezone
  const localMoment = moment.tz([year, month - 1, day, hour, minute], "Europe/London");
  const utcMoment = localMoment.utc();
  
  // Calculate Julian Day from UTC time
  const jd = calculateJulianDay(
    utcMoment.format("YYYY-MM-DD"),
    utcMoment.format("HH:mm")
  );
  
  const deltaT = 67.2;
  const jde = jd + deltaT / 86400;
  console.log("Julian Day:", jd);
  console.log("Julian Ephemeris Day:", jde);

  // Calculate obliquity
  const T = (jd - 2451545.0) / 36525;
  const eps = 23.43929111 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  const epsRad = deg2rad(eps);

  // Calculate sun position
  const sunLongRad = solar.apparentLongitude(jde);
  const sunLongDeg = rad2deg(sunLongRad);
  const normalizedSunLong = normalizeDegrees(sunLongDeg);
  
  // Calculate moon position
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
  const moonLongRad = calculateMoonLongitude(topoMoonPos, epsRad);
  const finalMoonLongitude = rad2deg(moonLongRad);

  // Get LST (RAMC)
  let ramc = sidereal.apparent(jde);
  ramc = ramc % 24;
  if (ramc < 0) ramc += 24;
  ramc = (ramc + data.longitude / 15) % 24;
  if (ramc < 0) ramc += 24;
  
  // Convert RAMC to radians (15° per hour)
  const ramcRad = deg2rad(ramc * 15);
  
  // Calculate ascendant using the direct formula
  const latRad = deg2rad(data.latitude);
  const numerator = Math.cos(ramcRad);
  const denominator = Math.sin(epsRad) * Math.tan(latRad) + Math.cos(epsRad) * Math.sin(ramcRad);
  const ascendant = normalizeDegrees(rad2deg(Math.atan2(numerator, denominator)));

  console.log("Rising sign calculation:", {
    ramc,
    ramcRad,
    latRad,
    ascendant
  });

  // Get zodiac positions
  const sunPosition = getZodiacPosition(normalizedSunLong);
  const moonPosition = getZodiacPosition(finalMoonLongitude);
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