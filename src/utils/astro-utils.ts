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

function calculateJulianDay(utcDate: string, utcTime: string): number {
  const [year, month, day] = utcDate.split('-').map(Number);
  const [hour, minute] = utcTime.split(':').map(Number);

  // Get JD for noon on the given date
  const jdNoon = CalendarGregorianToJD(year, month, day);

  // Calculate hours since noon
  const hoursSinceNoon = hour - 12 + minute / 60;

  // If time is after noon, move to the next Julian epoch (+1 day)
  const dayFraction = hoursSinceNoon >= 0 ? 1 + hoursSinceNoon / 24 : hoursSinceNoon / 24;

  // Final JD
  return jdNoon + dayFraction;
}

function calculateMoonLongitude(moonPos: { _ra: number; _dec: number }, epsRad: number): number {
  const { _ra: ra, _dec: dec } = moonPos;

  // Compute sine and cosine of the ecliptic longitude
  const sinLambda = Math.sin(ra) * Math.cos(epsRad) + Math.tan(dec) * Math.sin(epsRad);
  const cosLambda = Math.cos(ra);

  // Calculate the ecliptic longitude in radians
  const lambdaRad = Math.atan2(sinLambda, cosLambda);

  // Convert to degrees
  const lambdaDeg = (lambdaRad * 180) / Math.PI;

  // Normalize to [0, 360)
  const normalizedLambda = ((lambdaDeg % 360) + 360) % 360;

  console.log("Moon calculation steps:", {
    ra,
    dec,
    epsRad,
    sinLambda,
    cosLambda,
    lambdaRad,
    lambdaDeg,
    normalizedLambda
  });

  return normalizedLambda;
}

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
  
  // Calculate Julian Day using our new function
  const jd = calculateJulianDay(
    utcMoment.format('YYYY-MM-DD'),
    utcMoment.format('H:mm')
  );
  
  // Calculate Julian Ephemeris Day (adding deltaT correction)
  const deltaT = 67.2; // Approximate value for 1980
  const jde = jd + deltaT / 86400;
  console.log("Julian Day:", jd);
  console.log("Julian Ephemeris Day:", jde);

  // Calculate obliquity of the ecliptic first
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
  const eps = 23.43929111 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  const epsRad = deg2rad(eps);

  // Calculate Sun's apparent longitude (tropical)
  const sunLongRad = solar.apparentLongitude(jde);
  console.log("Raw solar.apparentLongitude() result in radians:", sunLongRad);
  const sunLongDeg = (sunLongRad * 180) / Math.PI;
  const normalizedSunLong = normalizeDegrees(sunLongDeg);
  console.log("Sun longitude (tropical):", normalizedSunLong);
  
  // Calculate Moon's position (tropical)
  const moonPos = getMoonPosition(jde);
  console.log("Raw Moon Position object:", moonPos);
  
  // Calculate Moon's longitude using the corrected formula
  const moonLongDeg = calculateMoonLongitude(moonPos, epsRad);
  const finalMoonLongitude = moonLongDeg; // Already normalized
  
  // Calculate Local Sidereal Time and RAMC
  const lst = sidereal.apparent(jde);
  const ramc = normalizeDegrees(rad2deg(lst) + data.longitude);
  console.log("RAMC:", ramc);
  
  // Calculate Ascendant
  const ascendant = calculateAscendant(ramc, data.latitude, epsRad);
  console.log("Ascendant:", ascendant);
  
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
