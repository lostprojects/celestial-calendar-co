import { BirthChartData, BirthChartResult } from "@/utils/astro-utils";
import { logTimeInputs, logTimezoneDetection, logTimeConversion } from "./time-logging";
import { logSunPosition, logSolarComponents, logMoonCalculations } from "./position-logging";
import { logZodiacPosition, logFinalPositions } from "./zodiac-logging";
import moment from "moment-timezone";

export function logAllAstroCalculations(data: BirthChartData) {
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
}

function findTimezoneFromCoords(lat: number, lng: number): string {
  return lng >= -12 && lng <= 0 && lat >= 35 && lat <= 60 ? 'Europe/London' :
         lng >= 0 && lng <= 20 && lat >= 35 && lat <= 60 ? 'Europe/Paris' :
         lng >= -180 && lng <= -50 && lat >= 24 && lat <= 50 ? 'America/New_York' :
         lng >= 100 && lng <= 145 && lat >= -45 && lat <= -10 ? 'Australia/Sydney' :
         'UTC';
}