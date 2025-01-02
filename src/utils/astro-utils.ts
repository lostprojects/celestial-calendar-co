import moment from 'moment-timezone';
import { position as getMoonPosition } from "astronomia/moonposition";
import * as solar from "astronomia/solar";
import * as sidereal from "astronomia/sidereal";
import * as nutation from "astronomia/nutation";
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

function calculateEOT(jd: number, deltaT: number) {
  const jde = jd + deltaT / 86400;
  const L0 = solar.meanLongitude(jde);
  const M = solar.meanAnomaly(jde);
  const epsilon = nutation.meanObliquity(jde);
  const eccentricity = solar.eccentricity(jde);
  const C = eccentricity * Math.sin(M);
  const EOT = solar.equationOfTime(jde);
  
  console.log("EOT calculation:", {
    meanLongitude: rad2deg(L0),
    meanAnomaly: rad2deg(M),
    obliquity: rad2deg(epsilon),
    eccentricity,
    equationOfCenter: rad2deg(C),
    equationOfTime: EOT
  });
  
  return EOT;
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

  // Calculate EOT correction
  const eot = calculateEOT(jd, deltaT);
  console.log("Equation of Time correction:", eot);

  console.log("Time calculations:", {
    localTime: localMoment.format(),
    utcTime: utcMoment.format(),
    julianDay: jd,
    julianEphemerisDay: jde
  });

  // Calculate obliquity (ε) for J2000.0
  const eps = 23.4392911;
  const epsRad = deg2rad(eps);

  // Calculate sun position with EOT correction
  const sunLongRad = solar.apparentLongitude(jde) + deg2rad(eot / 240); // Convert EOT minutes to degrees (1 degree = 4 minutes)
  const normalizedSunLong = rad2deg(sunLongRad);
  
  console.log("Sun position:", {
    longitudeRad: sunLongRad,
    longitudeDeg: normalizedSunLong,
    normalizedDeg: normalizedSunLong,
    eotCorrection: eot / 240
  });

  // Moon calculation section - DO NOT MODIFY ANYTHING HERE
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
  
  console.log("Moon calculations:", {
    distance: moonDistance,
    parallax,
    geoLat,
    lst,
    hourAngle,
    deltaRA,
    deltaDec,
    topocentric: topoMoonPos
  });

  const moonLongRad = calculateMoonLongitude(topoMoonPos, epsRad);
  const finalMoonLongitude = rad2deg(moonLongRad);

  // Rising sign calculation - ONLY MODIFYING THIS SECTION
  const gst = sidereal.apparent(jde) % 24; // Normalize to 0-24 hours
  const localSiderealTime = gst + data.longitude/15; // Convert to LST
  const localSiderealDeg = localSiderealTime * 15; // Convert to degrees
  const localSiderealRad = deg2rad(localSiderealDeg);
  
  console.log("LST calculation:", {
    gstHours: gst,
    longitudeHours: data.longitude/15,
    lstHours: localSiderealTime,
    lstDegrees: localSiderealDeg,
    lstRadians: localSiderealRad
  });
  
  // Calculate Ascendant using atan2 with PROPERLY swapped x,y parameters
  const latRad = deg2rad(data.latitude);
  const y = Math.cos(localSiderealRad);
  const x = Math.sin(localSiderealRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  let ascendant = rad2deg(Math.atan2(x, y)); // PROPERLY swapped to (x,y)
  ascendant = normalizeDegrees(ascendant);

  // Get zodiac positions
  const sunPosition = getZodiacPosition(normalizedSunLong);
  const moonPosition = getZodiacPosition(finalMoonLongitude);
  const ascPosition = getZodiacPosition(ascendant);

  console.log("Final zodiac positions:", {
    sun: sunPosition,
    moon: moonPosition,
    ascendant: ascPosition
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
  
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degrees,
    minutes
  };
}
