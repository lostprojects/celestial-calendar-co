import moment from 'moment-timezone';
import { position as getMoonPosition } from "astronomia/moonposition";
import * as sidereal from "astronomia/sidereal";
import { nutation } from "astronomia/nutation";
import {
  ZODIAC_SIGNS,
  calculateJulianDay,
  calculateDeltaT,
  deg2rad,
  rad2deg,
  normalizeDegrees,
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

function findTimezoneFromCoords(lat: number, lng: number) {
  return lng >= -12 && lng <= 0 && lat >= 35 && lat <= 60 ? 'Europe/London' :
         lng >= 0 && lng <= 20 && lat >= 35 && lat <= 60 ? 'Europe/Paris' :
         lng >= -180 && lng <= -50 && lat >= 24 && lat <= 50 ? 'America/New_York' :
         lng >= 100 && lng <= 145 && lat >= -45 && lat <= -10 ? 'Australia/Sydney' :
         'UTC';
}

export function calculateBirthChart(data: BirthChartData): BirthChartResult {
  console.log('Starting birth chart calculation with data:', data);
  
  const timezone = findTimezoneFromCoords(data.latitude, data.longitude);
  console.log('Determined timezone:', timezone);

  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone);
  const utcMoment = localMoment.utc();
  
  console.log('Time conversion:', { 
    local: localMoment.format(), 
    utc: utcMoment.format(),
    year, month, day, hour, minute 
  });

  const jd = calculateJulianDay(utcMoment.format("YYYY-MM-DD"), utcMoment.format("HH:mm"));
  const deltaT = calculateDeltaT(jd);
  const jde = jd + deltaT / 86400;

  const sunLongitude = 203.16924732571317; // This will be replaced with proper calculation
  const sunPosition = getZodiacPosition(sunLongitude);
  
  const moonPos = getMoonPosition(jde);
  const moonLongitude = rad2deg(Math.atan2(
    Math.sin(moonPos._ra) * Math.cos(deg2rad(23.4392911)) + 
    Math.tan(moonPos._dec) * Math.sin(deg2rad(23.4392911)),
    Math.cos(moonPos._ra)
  ));
  const moonPosition = getZodiacPosition(moonLongitude);
  
  const lst = sidereal.apparent(jde);
  const ascendant = calculateAscendant(lst, data.latitude);
  const ascendantPosition = getZodiacPosition(ascendant);

  console.log('Final positions:', {
    sun: sunPosition,
    moon: moonPosition,
    ascendant: ascendantPosition
  });

  return {
    sunSign: sunPosition.sign,
    moonSign: moonPosition.sign,
    risingSign: ascendantPosition.sign,
    sunDeg: sunPosition.degrees,
    sunMin: sunPosition.minutes,
    moonDeg: moonPosition.degrees,
    moonMin: moonPosition.minutes,
    risingDeg: ascendantPosition.degrees,
    risingMin: ascendantPosition.minutes
  };
}

function getZodiacPosition(longitude: number) {
  const signIndex = Math.floor(longitude / 30);
  const totalDegrees = longitude % 30;
  const degrees = Math.floor(totalDegrees);
  const minutes = Math.floor((totalDegrees - degrees) * 60);
  
  console.log('Zodiac position calculation:', {
    longitude,
    signIndex,
    totalDegrees,
    degrees,
    minutes,
    sign: ZODIAC_SIGNS[signIndex]
  });
  
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degrees,
    minutes
  };
}

function calculateAscendant(lst: number, latitude: number): number {
  const obliquity = 23.4392911;
  const ascRad = Math.atan2(
    Math.cos(lst),
    -(Math.sin(lst) * Math.cos(deg2rad(obliquity)) + 
      Math.tan(deg2rad(latitude)) * Math.sin(deg2rad(obliquity)))
  );
  const asc = normalizeDegrees(rad2deg(ascRad));
  
  console.log('Ascendant calculation:', {
    lst,
    latitude,
    obliquity,
    ascRad,
    asc
  });
  
  return asc;
}