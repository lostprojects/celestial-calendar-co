import { julian, solar, moonposition, nutation, sidereal } from "astronomia";
import moment from "moment-timezone";

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

  console.log(`Calculating ${system} birth chart with:`, {
    birthDate, birthTime, birthPlace, latitude, longitude
  });

  // Use Europe/London for UK locations
  const timezone = birthPlace.toLowerCase().includes("uk") 
    ? "Europe/London" 
    : birthPlace;
  
  const localTime = moment.tz(`${birthDate}T${birthTime}`, timezone);
  
  console.log("Parsed Local Time:", {
    formatted: localTime.format(),
    utc: localTime.utc().format(),
    jsDate: localTime.toDate(),
    zone: localTime.tz()
  });

  // Get Julian Days (UT)
  const jdUT = julian.DateToJD(localTime.toDate());
  console.log("Julian Day (UT):", jdUT);

  // Calculate Delta T and get TT
  const deltaTsec = approximateDeltaT(localTime.year(), localTime.month() + 1);
  const jdTT = jdUT + deltaTsec / 86400;
  console.log("Delta T (seconds):", deltaTsec);
  console.log("Julian Day (TT):", jdTT);

  // Get tropical positions directly from astronomia
  const sunLonTrop = solar.apparentLongitude(jdTT);
  const moonLonTrop = moonposition.position(jdTT).lon;
  const ascLonTrop = calcAscendant(jdUT, latitude, longitude);
  
  console.log("Tropical positions:", {
    sunLonTrop,
    moonLonTrop,
    ascLonTrop
  });

  // For sidereal calculations, apply ayanamsa
  let finalPositions;
  if (system === "sidereal") {
    const ayanamsa = approximateAyanamsa(localTime.year());
    finalPositions = {
      sunLon: wrap360(sunLonTrop - ayanamsa),
      moonLon: wrap360(moonLonTrop - ayanamsa),
      ascLon: wrap360(ascLonTrop - ayanamsa)
    };
    console.log("Sidereal positions after ayanamsa:", {
      ayanamsa,
      ...finalPositions
    });
  } else {
    finalPositions = {
      sunLon: sunLonTrop,
      moonLon: moonLonTrop,
      ascLon: ascLonTrop
    };
  }

  // Convert to signs and degrees
  const sunObj = extractSignDegrees(finalPositions.sunLon);
  const moonObj = extractSignDegrees(finalPositions.moonLon);
  const ascObj = extractSignDegrees(finalPositions.ascLon);

  console.log(`Final ${system} positions:`, {
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

function approximateDeltaT(year: number, month: number) {
  const yMid = 2020;
  const base = 69.4; // sec in 2020
  const slope = 0.2; // sec/yr
  const yearsOffset = (year + (month - 0.5) / 12) - yMid;
  return base + slope * yearsOffset; 
}

function approximateAyanamsa(year: number) {
  const baseYear = 2020;
  const baseAyanamsa = 24; 
  const yearsDiff = year - baseYear;
  const shiftDeg = yearsDiff / 72;
  return baseAyanamsa - shiftDeg;
}

function wrap360(deg: number) {
  return ((deg % 360) + 360) % 360;
}

function extractSignDegrees(longitude: number) {
  const normalized = wrap360(longitude);
  const signIndex = Math.floor(normalized / 30);

  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const sign = signs[signIndex];
  const degreesIntoSign = normalized - signIndex * 30;
  const degWhole = Math.floor(degreesIntoSign);
  let minWhole = Math.round((degreesIntoSign - degWhole) * 60);

  let finalDeg = degWhole;
  if (minWhole === 60) {
    finalDeg += 1;
    minWhole = 0;
  }

  return { sign, deg: finalDeg, min: minWhole };
}

function calcAscendant(jdUT: number, lat: number, lon: number): number {
  // Get apparent sidereal time in hours
  const gastH = sidereal.apparent(jdUT);
  
  // Convert to degrees and add longitude for local sidereal time
  const lstDeg = wrap360(gastH * 15 + lon);
  const lstRad = lstDeg * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  
  // Get true obliquity (already in radians from astronomia)
  const eps = nutation.meanObliquity(jdUT) + nutation.nutation(jdUT).deps;

  // Calculate ascendant
  const ascRad = Math.atan2(
    Math.cos(lstRad),
    -Math.sin(lstRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps)
  );
  
  return wrap360(ascRad * 180 / Math.PI);
}