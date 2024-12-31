import { CalendarGregorianToJD } from "astronomia/julian";
import * as solar from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as sidereal from "astronomia/sidereal";
import moment from 'moment-timezone';

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

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export function calculateBirthChart(data: BirthChartData): BirthChartResult {
  // Parse input date/time
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
  
  // Calculate Julian Day using UTC components, being careful to use the correct date
  const jd = CalendarGregorianToJD(
    utcMoment.year(),
    utcMoment.month() + 1,
    utcMoment.date() + (utcMoment.hours() + utcMoment.minutes() / 60.0) / 24.0
  );
  
  // Calculate Julian Ephemeris Day (adding deltaT correction)
  const deltaT = 67.2; // Approximate value for 1980
  const jde = jd + deltaT / 86400;
  console.log("Julian Day:", jd);
  console.log("Julian Ephemeris Day:", jde);
  
  // Calculate Sun's apparent longitude (tropical)
  const sunLongRad = solar.apparentLongitude(jde);
  const sunLongDeg = rad2deg(sunLongRad);
  const normalizedSunLong = normalizeDegrees(sunLongDeg);
  console.log("Sun longitude (tropical):", normalizedSunLong);
  
  // Calculate Moon's position (tropical)
  const moonPos = getMoonPosition(jde);
  const moonLongDeg = rad2deg(moonPos.lon);
  const normalizedMoonLong = normalizeDegrees(moonLongDeg);
  console.log("Moon longitude (tropical):", normalizedMoonLong);
  
  // Calculate obliquity of the ecliptic
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
  const eps = 23.43929111 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  const epsRad = deg2rad(eps);
  
  // Calculate Local Sidereal Time and RAMC
  const lst = sidereal.apparent(jde);
  const ramc = normalizeDegrees(rad2deg(lst) + data.longitude);
  console.log("RAMC:", ramc);
  
  // Calculate Ascendant
  const ascendant = calculateAscendant(ramc, data.latitude, epsRad);
  console.log("Ascendant:", ascendant);
  
  // Get zodiac positions
  const sunPosition = getZodiacPosition(normalizedSunLong);
  const moonPosition = getZodiacPosition(normalizedMoonLong);
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
  
  // Calculate ascendant using spherical trigonometry
  const tanAsc = -Math.cos(ramcRad) / 
                 (Math.sin(obliquity) * Math.tan(latRad) + 
                  Math.cos(obliquity) * Math.sin(ramcRad));
  
  let ascendant = rad2deg(Math.atan(tanAsc));
  
  // Adjust quadrant based on RAMC
  if (ramc >= 180) {
    ascendant += 180;
  }
  
  return normalizeDegrees(ascendant);
}

function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
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

// Angle conversion helpers
function deg2rad(degrees: number): number {
  return degrees * Math.PI / 180;
}

function rad2deg(radians: number): number {
  return radians * 180 / Math.PI;
}
