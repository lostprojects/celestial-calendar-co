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
  console.log("Time calculations:", {
    localTime: localMoment.format(),
    utcTime: utcMoment.format(),
    julianDay: jd,
    julianEphemerisDay: jde
  });

  // Calculate obliquity (ε) for J2000.0
  const eps = 23.4392911; // Exact value for J2000.0
  const epsRad = deg2rad(eps);

  // Calculate sun position
  const sunLongRad = solar.apparentLongitude(jde);
  const sunLongDeg = rad2deg(sunLongRad);
  const normalizedSunLong = normalizeDegrees(sunLongDeg);
  
  console.log("Sun position:", {
    longitudeRad: sunLongRad,
    longitudeDeg: sunLongDeg,
    normalizedDeg: normalizedSunLong
  });
  
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

  // Get LST (Local Sidereal Time) following astronomia docs exactly
  const gst = sidereal.apparent(jde); // Get Greenwich Sidereal Time in hours
  const lst = gst + data.longitude/15; // Convert to Local Sidereal Time in hours
  const lstDeg = lst * 15; // Convert hours to degrees
  const lstRad = deg2rad(lstDeg);
  
  console.log("LST calculation:", {
    gstHours: gst,
    longitudeHours: data.longitude/15,
    lstHours: lst,
    lstDegrees: lstDeg,
    lstRadians: lstRad
  });
  
  // Calculate Ascendant using atan2
  const latRad = deg2rad(data.latitude);
  const y = Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  let ascendant = rad2deg(Math.atan2(y, x));
  ascendant = normalizeDegrees(ascendant);

  console.log("Ascendant calculation:", {
    latitudeRad: latRad,
    y,
    x,
    rawAscendant: ascendant,
    normalizedAscendant: ascendant
  });

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
