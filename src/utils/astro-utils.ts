import { solar, moonposition } from "astronomia";
import moment from "moment-timezone";
import { calculateJulianDays } from "./time-utils";
import { calculateSiderealTime, calculateAscendant } from "./coordinate-utils";
import { extractSignDegrees, approximateAyanamsa } from "./zodiac-utils";

export type AstroSystem = "tropical" | "sidereal";

export interface BirthChartData {
  name: string;
  birthDate: string;   
  birthTime: string;   
  birthPlace: string;  
  latitude: number;
  longitude: number;
}

export interface BirthChartResult {
  sunSign: string;
  sunDeg: number;
  sunMin: number;
  moonSign: string;
  moonDeg: number;
  moonMin: number;
  risingSign: string;
  risingDeg: number;
  risingMin: number;
}

export function calculateBirthChart(
  data: BirthChartData,
  system: AstroSystem
): BirthChartResult {
  const { birthDate, birthTime, birthPlace, latitude, longitude } = data;

  console.log(`[DEBUG] Starting birth chart calculation for:`, {
    birthDate, birthTime, birthPlace, latitude, longitude, system
  });

  // Handle UK timezone
  const ukTerms = ["uk", "united kingdom", "england", "scotland", "wales", "northern ireland"];
  const isUKLocation = ukTerms.some(term => 
    birthPlace.toLowerCase().includes(term)
  );
  
  const timezone = isUKLocation ? "Europe/London" : birthPlace;
  const localTime = moment.tz(`${birthDate}T${birthTime}`, timezone);
  
  console.log("[DEBUG] Local time:", {
    formatted: localTime.format(),
    utc: localTime.utc().format(),
    jsDate: localTime.toDate(),
    zone: localTime.tz(),
    offset: localTime.utcOffset()
  });

  // Calculate Julian Days
  const { jdUT, jdTT } = calculateJulianDays(
    localTime.year(),
    localTime.month() + 1,
    localTime.date(),
    localTime.hour(),
    localTime.minute()
  );

  // Calculate sidereal time and nutation
  const { gastH, epsTrue } = calculateSiderealTime(jdUT, jdTT);

  // Calculate tropical positions
  const sunLonTrop = solar.apparentLongitude(jdTT) * 180 / Math.PI;
  const moonLonTrop = moonposition.position(jdTT).lon * 180 / Math.PI;
  const ascLonTrop = calculateAscendant(gastH, latitude, longitude, epsTrue);
  
  console.log("[DEBUG] Tropical positions:", {
    sunLonTrop,
    moonLonTrop,
    ascLonTrop
  });

  // Apply ayanamsa for sidereal calculations
  let finalPositions;
  if (system === "sidereal") {
    const ayanamsa = approximateAyanamsa(localTime.year());
    finalPositions = {
      sunLon: ((sunLonTrop - ayanamsa + 360) % 360),
      moonLon: ((moonLonTrop - ayanamsa + 360) % 360),
      ascLon: ((ascLonTrop - ayanamsa + 360) % 360)
    };
    console.log("[DEBUG] Sidereal positions:", finalPositions);
  } else {
    finalPositions = {
      sunLon: sunLonTrop,
      moonLon: moonLonTrop,
      ascLon: ascLonTrop
    };
  }

  // Extract signs and degrees
  const sunObj = extractSignDegrees(finalPositions.sunLon);
  const moonObj = extractSignDegrees(finalPositions.moonLon);
  const ascObj = extractSignDegrees(finalPositions.ascLon);

  console.log(`[DEBUG] Final ${system} positions:`, {
    sun: sunObj,
    moon: moonObj,
    asc: ascObj
  });

  return {
    sunSign: sunObj.sign,
    sunDeg: sunObj.deg,
    sunMin: sunObj.min,
    moonSign: moonObj.sign,
    moonDeg: moonObj.deg,
    moonMin: moonObj.min,
    risingSign: ascObj.sign,
    risingDeg: ascObj.deg,
    risingMin: ascObj.min,
  };
}