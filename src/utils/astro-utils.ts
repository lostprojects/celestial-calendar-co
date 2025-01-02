import moment from 'moment-timezone';
import { position as getMoonPosition } from "astronomia/moonposition";
import * as solar from "astronomia/solar";
import * as sidereal from "astronomia/sidereal";
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

  const timezone = moment.tz.guess();
  const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone);
  const utcMoment = localMoment.utc();
  
  const jd = calculateJulianDay(
    utcMoment.format("YYYY-MM-DD"),
    utcMoment.format("HH:mm")
  );
  
  const deltaT = calculateDeltaT(jd);
  const jde = jd + deltaT / 86400;
  
  const eot = calculateEquationOfTime(jde);
  const correctedJde = jde + eot;
  
  console.log("Time calculations:", {
    localTime: localMoment.format(),
    utcTime: utcMoment.format(),
    julianDay: jd,
    julianEphemerisDay: jde,
    equationOfTime: eot,
    correctedJde: correctedJde
  });

  const eps = 23.4392911;
  const epsRad = deg2rad(eps);

  // The only actual change is here - we add 180° to the sun longitude
  const sunLongRad = solar.apparentLongitude(correctedJde);
  let normalizedSunLong = rad2deg(sunLongRad) + 180;
  normalizedSunLong = ((normalizedSunLong % 360) + 360) % 360;
  
  console.log("Sun position:", {
    longitudeRad: sunLongRad,
    longitudeDeg: normalizedSunLong,
    normalizedDeg: normalizedSunLong
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

  const gst = sidereal.apparent(correctedJde) % 24;
  const localSiderealTime = gst + data.longitude/15;
  const localSiderealDeg = localSiderealTime * 15;
  const localSiderealRad = deg2rad(localSiderealDeg);
  
  console.log("LST calculation:", {
    gstHours: gst,
    longitudeHours: data.longitude/15,
    lstHours: localSiderealTime,
    lstDegrees: localSiderealDeg,
    lstRadians: localSiderealRad
  });
  
  const latRad = deg2rad(data.latitude);
  const y = Math.cos(localSiderealRad);
  const x = Math.sin(localSiderealRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  let ascendant = rad2deg(Math.atan2(x, y));
  ascendant = normalizeDegrees(ascendant);

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