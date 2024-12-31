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

  // Create moment in local timezone (Europe/London)
  const localMoment = moment.tz([year, month - 1, day, hour, minute], "Europe/London");
  console.log("Local time:", localMoment.format());
  
  // Convert to UTC
  const utcMoment = localMoment.utc();
  console.log("UTC time:", utcMoment.format());
  
  const jd = calculateJulianDay(
    utcMoment.format('YYYY-MM-DD'),
    utcMoment.format('H:mm')
  );
  
  const deltaT = 67.2;
  const jde = jd + deltaT / 86400;
  console.log("Julian Day:", jd);
  console.log("Julian Ephemeris Day:", jde);

  const T = (jd - 2451545.0) / 36525;
  const eps = 23.43929111 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  const epsRad = deg2rad(eps);

  const sunLongRad = solar.apparentLongitude(jde);
  console.log("Raw solar.apparentLongitude() result in radians:", sunLongRad);
  const sunLongDeg = rad2deg(sunLongRad);
  const normalizedSunLong = normalizeDegrees(sunLongDeg);
  console.log("Sun longitude (tropical):", normalizedSunLong);
  
  // Moon position with topocentric correction
  const moonPos = getMoonPosition(jde);
  console.log("Raw Moon Position object:", moonPos);
  
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
  
  // Calculate Moon longitude in radians, normalize to [0, 2π)
  const moonLongRad = calculateMoonLongitude(topoMoonPos, epsRad);
  const finalMoonLongitude = rad2deg(moonLongRad);

  const RAMC = lst * 15;
  const ascendant = calculateAscendant(RAMC, data.latitude, eps);
  console.log("Ascendant calculation:", {
    RAMC,
    latitude: data.latitude,
    obliquity: eps,
    result: ascendant
  });

  // Get zodiac positions
  const sunPosition = getZodiacPosition(normalizedSunLong);
  const moonPosition = getZodiacPosition(finalMoonLongitude);
  const ascPosition = getZodiacPosition(ascendant);
  
  console.log("Final positions:", {
    sun: sunPosition,
    moon: moonPosition,
    asc: ascPosition
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

function calculateAscendant(ramc: number, latitude: number, obliquity: number): number {
  // Convert inputs to radians
  const ramcRad = deg2rad(ramc);
  const latRad = deg2rad(latitude);
  const obliqRad = deg2rad(obliquity);
  
  // Calculate ascendant using spherical trigonometry
  const tanAsc = -Math.cos(ramcRad) / 
                 (Math.sin(obliqRad) * Math.tan(latRad) + 
                  Math.cos(obliqRad) * Math.sin(ramcRad));
  
  let ascendant = rad2deg(Math.atan(tanAsc));
  
  // Adjust quadrant based on RAMC
  if (ramc >= 180) {
    ascendant += 180;
  }
  
  return normalizeDegrees(ascendant);
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
