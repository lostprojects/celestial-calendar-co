import moment from 'moment-timezone';
import { position as getMoonPosition } from "astronomia/moonposition";
import * as solar from "astronomia/solar";
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
  normalizeDegrees
} from './astro-core';
import { 
  logBirthChartCalculation,
  logZodiacPosition,
  logTimezoneDetection
} from '@/logging/astro/utils-logging';

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
  const timezone = lng >= -12 && lng <= 0 && lat >= 35 && lat <= 60 ? 'Europe/London' :
                   lng >= 0 && lng <= 20 && lat >= 35 && lat <= 60 ? 'Europe/Paris' :
                   lng >= -180 && lng <= -50 && lat >= 24 && lat <= 50 ? 'America/New_York' :
                   lng >= 100 && lng <= 145 && lat >= -45 && lat <= -10 ? 'Australia/Sydney' :
                   'UTC';

  logTimezoneDetection({
    input: { latitude: lat, longitude: lng },
    result: timezone
  });

  return timezone;
}

export function calculateBirthChart(data: BirthChartData): BirthChartResult {
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  logTimeInputs(data);

  const timezone = findTimezoneFromCoords(data.latitude, data.longitude);
  logTimezoneDetection(timezone, { lat: data.latitude, lng: data.longitude });

  const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone);
  const utcMoment = localMoment.utc();
  
  logTimeConversion(localMoment, utcMoment);

  const jd = calculateJulianDay(
    utcMoment.format("YYYY-MM-DD"),
    utcMoment.format("HH:mm")
  );
  
  const deltaT = calculateDeltaT(jd);
  const jde = jd + deltaT / 86400;
  const eot = calculateEquationOfTime(jde);
  
  logJulianCalculations(jd, deltaT, jde, eot);

  const eps = 23.4392911;
  const epsRad = deg2rad(eps);

  const meanLongitude = solar.meanLongitude(jde);
  const nutationCorr = nutation.nutation(jde).deltaPsi;
  const sunLongRad = solar.apparentLongitude(jde);
  
  logSolarComponents(
    rad2deg(meanLongitude),
    rad2deg(sunLongRad),
    rad2deg(nutationCorr),
    eps
  );

  let normalizedSunLong = rad2deg(sunLongRad);
  normalizedSunLong = ((normalizedSunLong % 360) + 360) % 360;
  
  logSunPosition(sunLongRad, normalizedSunLong, normalizedSunLong);

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
  
  logMoonCalculations(moonDistance, parallax, geoLat, lst, hourAngle, deltaRA, deltaDec, topoMoonPos);

  const moonLongRad = calculateMoonLongitude(topoMoonPos, epsRad);
  const finalMoonLongitude = rad2deg(moonLongRad);

  const gst = sidereal.apparent(jde) % 24;
  const localSiderealTime = gst + data.longitude/15;
  const localSiderealDeg = localSiderealTime * 15;
  const localSiderealRad = deg2rad(localSiderealDeg);
  
  logCoordinateCalculations(data.latitude, data.longitude, geoLat, localSiderealTime);
  
  const latRad = deg2rad(data.latitude);
  const y = Math.cos(localSiderealRad);
  const x = Math.sin(localSiderealRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  let ascendant = rad2deg(Math.atan2(x, y));
  ascendant = normalizeDegrees(ascendant);

  const sunPosition = getZodiacPosition(normalizedSunLong);
  const moonPosition = getZodiacPosition(finalMoonLongitude);
  const ascPosition = getZodiacPosition(ascendant);

  logFinalPositions(sunPosition, moonPosition, ascPosition);

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
  
  const result = {
    sign: ZODIAC_SIGNS[signIndex],
    degrees,
    minutes
  };

  logZodiacPosition({
    input: { longitude },
    intermediate: {
      signIndex,
      totalDegrees,
      degrees,
      minutes
    },
    result
  });
  
  return result;
}
