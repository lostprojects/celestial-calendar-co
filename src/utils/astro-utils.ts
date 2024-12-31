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

  // Get GST and normalize to [0, 24)
  let gst = sidereal.apparent(jde);
  gst = gst % 24;
  if (gst < 0) gst += 24;

  // Convert longitude to hours and calculate LST
  let longitudeHours = data.longitude / 15;
  let lst = gst + longitudeHours;

  // Normalize LST to [0, 24)
  lst = lst % 24;
  if (lst < 0) lst += 24;

  // Convert LST directly to radians
  let lstRad = lst * (Math.PI / 12);

  // Calculate ascendant using spherical trig formula
  let latRad = deg2rad(data.latitude);
  let tanAsc = -(Math.cos(lstRad)) / 
               (Math.sin(epsRad) * Math.tan(latRad) + 
                Math.cos(epsRad) * Math.sin(lstRad));
                
  // Get initial ascendant value in radians
  let ascRad = Math.atan(tanAsc);
  
  // Correct quadrant based on LST
  if (Math.cos(lstRad) < 0) {
    ascRad += Math.PI;
  } else if (Math.cos(lstRad) >= 0 && Math.sin(lstRad) < 0) {
    ascRad += 2 * Math.PI;
  }
  
  // Convert to degrees and normalize
  let ascendant = normalizeDegrees(rad2deg(ascRad));

  console.log("Rising sign calculation:", {
    gst,
    longitudeHours,
    lst,
    lstRad,
    ascRad,
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