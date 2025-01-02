import { BirthChartData, BirthChartResult } from "@/utils/astro-utils";
import { logTimeInputs, logTimezoneDetection, logTimeConversion, logJulianCalculations } from "./time-logging";
import { logSunPosition, logSolarComponents, logMoonCalculations } from "./position-logging";
import { logZodiacPosition, logFinalPositions } from "./zodiac-logging";
import { logCoordinateCalculations } from "./coordinate-logging";
import moment from "moment-timezone";

export function logAllAstroCalculations(data: BirthChartData, calculationFunction: (data: BirthChartData) => BirthChartResult) {
  // Log initial input data
  logTimeInputs(data);

  // Detect and log timezone
  const timezone = findTimezoneFromCoords(data.latitude, data.longitude);
  logTimezoneDetection(timezone, { lat: data.latitude, lng: data.longitude });

  // Convert and log time
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone);
  const utcMoment = localMoment.utc();
  logTimeConversion(localMoment, utcMoment);

  // Calculate and log Julian dates
  const jd = calculateJulianDay(utcMoment.format("YYYY-MM-DD"), utcMoment.format("HH:mm"));
  const deltaT = calculateDeltaT(jd);
  const jde = jd + deltaT / 86400;
  const eot = calculateEquationOfTime(jde);
  logJulianCalculations(jd, deltaT, jde, eot);

  // Calculate and log solar position
  const meanLongitude = calculateMeanSolarLongitude(jde);
  const nutationCorr = nutation.nutation(jde).deltaPsi;
  const sunLongRad = deg2rad(meanLongitude + nutationCorr);
  const normalizedSunLong = normalizeDegrees(rad2deg(sunLongRad));
  logSunPosition(sunLongRad, rad2deg(sunLongRad), normalizedSunLong);
  logSolarComponents(meanLongitude, rad2deg(sunLongRad), rad2deg(nutationCorr), 23.4392911);

  // Calculate and log lunar position
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

  // Log coordinate calculations
  logCoordinateCalculations(data.latitude, data.longitude, geoLat, lst);

  // Calculate final positions and log them
  const result = calculationFunction(data);
  logFinalPositions(
    { sign: result.sunSign, degrees: result.sunDeg, minutes: result.sunMin },
    { sign: result.moonSign, degrees: result.moonDeg, minutes: result.moonMin },
    { sign: result.risingSign, degrees: result.risingDeg, minutes: result.risingMin }
  );

  return result;
}

function findTimezoneFromCoords(lat: number, lng: number): string {
  return lng >= -12 && lng <= 0 && lat >= 35 && lat <= 60 ? 'Europe/London' :
         lng >= 0 && lng <= 20 && lat >= 35 && lat <= 60 ? 'Europe/Paris' :
         lng >= -180 && lng <= -50 && lat >= 24 && lat <= 50 ? 'America/New_York' :
         lng >= 100 && lng <= 145 && lat >= -45 && lat <= -10 ? 'Australia/Sydney' :
         'UTC';
}