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

  console.log(`[DEBUG] Starting birth chart calculation for:`, {
    birthDate, birthTime, birthPlace, latitude, longitude, system
  });

  // Check for various UK location strings
  const ukTerms = ["uk", "united kingdom", "england", "scotland", "wales", "northern ireland"];
  const isUKLocation = ukTerms.some(term => 
    birthPlace.toLowerCase().includes(term)
  );
  
  const timezone = isUKLocation ? "Europe/London" : birthPlace;
  const localTime = moment.tz(`${birthDate}T${birthTime}`, timezone);
  
  console.log("[DEBUG] Parsed Local Time:", {
    formatted: localTime.format(),
    utc: localTime.utc().format(),
    jsDate: localTime.toDate(),
    zone: localTime.tz(),
    offset: localTime.utcOffset()
  });

  // Get Julian Days (UT) using direct calculation
  const year = localTime.year();
  const month = localTime.month() + 1;
  const day = localTime.date();
  const hour = localTime.hour();
  const minute = localTime.minute();
  const fractionOfDay = (hour + minute / 60) / 24;

  console.log("[DEBUG] Julian Day inputs:", {
    year, month, day, hour, minute, fractionOfDay
  });

  const jdUT = julian.CalendarGregorianToJD(year, month, day + fractionOfDay);
  console.log("[DEBUG] Julian Day (UT):", jdUT);

  // Calculate Delta T and get TT
  const deltaTsec = approximateDeltaT(year, month);
  const jdTT = jdUT + deltaTsec / 86400;
  
  console.log("[DEBUG] Time conversion:", {
    deltaTsec,
    jdUT,
    jdTT,
    difference: jdTT - jdUT
  });

  // Get nutation parameters for ascendant calculation
  const { dpsi, deps } = nutation.nutation(jdTT);
  const meanEps = nutation.meanObliquity(jdTT);
  const epsTrue = meanEps + deps;
  
  console.log("[DEBUG] Nutation Parameters:", {
    dpsi, deps, meanEps, epsTrue
  });

  // Get tropical positions directly from astronomia
  const sunLonTrop = solar.apparentLongitude(jdTT);
  const moonLonTrop = moonposition.position(jdTT).lon;
  const ascLonTrop = calcAscendant(jdUT, jdTT, latitude, longitude, dpsi, epsTrue);
  
  console.log("[DEBUG] Raw tropical positions:", {
    sunLonTrop,
    moonLonTrop,
    ascLonTrop,
    sunLonDeg: sunLonTrop * 180 / Math.PI,
    moonLonDeg: moonLonTrop * 180 / Math.PI,
  });

  // For sidereal calculations, apply ayanamsa
  let finalPositions;
  if (system === "sidereal") {
    const ayanamsa = approximateAyanamsa(year);
    finalPositions = {
      sunLon: wrap360(sunLonTrop - ayanamsa),
      moonLon: wrap360(moonLonTrop - ayanamsa),
      ascLon: wrap360(ascLonTrop - ayanamsa)
    };
    console.log("[DEBUG] Sidereal positions after ayanamsa:", {
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

function approximateDeltaT(year: number, month: number) {
  const yMid = 2020;
  const base = 69.4; // sec in 2020
  const slope = 0.2; // sec/yr
  const yearsOffset = (year + (month - 0.5) / 12) - yMid;
  const result = base + slope * yearsOffset;
  
  console.log("[DEBUG] Delta T calculation:", {
    year, month, yearsOffset,
    formula: `${base} + ${slope} * ${yearsOffset}`,
    result
  });
  
  return result;
}

function approximateAyanamsa(year: number) {
  const baseYear = 2020;
  const baseAyanamsa = 24; 
  const yearsDiff = year - baseYear;
  const shiftDeg = yearsDiff / 72;
  const result = baseAyanamsa - shiftDeg;
  
  console.log("[DEBUG] Ayanamsa calculation:", {
    year, yearsDiff, shiftDeg,
    formula: `${baseAyanamsa} - (${yearsDiff} / 72)`,
    result
  });
  
  return result;
}

function wrap360(deg: number) {
  const result = ((deg % 360) + 360) % 360;
  console.log("[DEBUG] wrap360:", { input: deg, result });
  return result;
}

function extractSignDegrees(longitude: number) {
  console.log("[DEBUG] extractSignDegrees input:", longitude);
  
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

  console.log("[DEBUG] Sign extraction:", {
    longitude,
    normalized,
    signIndex,
    sign,
    degreesIntoSign,
    finalDeg,
    minWhole
  });

  return { sign, deg: finalDeg, min: minWhole };
}

function calcAscendant(
  jdUT: number, 
  jdTT: number, 
  lat: number, 
  lon: number,
  dpsi: number,
  epsTrue: number
): number {
  console.log("[DEBUG] Ascendant calculation inputs:", {
    jdUT, jdTT, lat, lon, dpsi, epsTrue
  });
  
  // Get apparent sidereal time in hours using nutation parameters
  const gastH = sidereal.apparent(jdUT, dpsi, epsTrue);
  
  // Convert to degrees and add longitude for local sidereal time
  const lstDeg = wrap360(gastH * 15 + lon);
  const lstRad = lstDeg * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  
  console.log("[DEBUG] Ascendant intermediate values:", {
    gastH,
    lstDeg,
    lstRad,
    latRad,
    epsTrueRad: epsTrue * Math.PI / 180
  });
  
  // Calculate ascendant using true obliquity
  const epsTrueRad = epsTrue * Math.PI / 180;
  const cosLst = Math.cos(lstRad);
  const sinLst = Math.sin(lstRad);
  const cosEps = Math.cos(epsTrueRad);
  const sinEps = Math.sin(epsTrueRad);
  const tanLat = Math.tan(latRad);
  
  console.log("[DEBUG] Ascendant trig values:", {
    cosLst, sinLst, cosEps, sinEps, tanLat
  });
  
  const numerator = cosLst;
  const denominator = -sinLst * cosEps + tanLat * sinEps;
  
  console.log("[DEBUG] Ascendant atan2 inputs:", {
    numerator, denominator
  });
  
  const ascRad = Math.atan2(numerator, denominator);
  const ascDeg = wrap360(ascRad * 180 / Math.PI);
  
  console.log("[DEBUG] Ascendant final values:", {
    ascRad,
    ascDeg
  });
  
  return ascDeg;
}