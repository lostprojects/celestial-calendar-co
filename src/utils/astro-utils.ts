import { julian, solar, moonposition, nutation, sidereal } from "astronomia";
import moment from "moment-timezone";

const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

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

function debugLog(message: string, data: any) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[DEBUG] ${message}:`, data);
  }
}

function validateNumericValue(value: number, name: string): number {
  if (typeof value !== 'number' || isNaN(value)) {
    const error = `Invalid ${name}: ${value}`;
    console.error(`[ERROR] ${error}`);
    throw new Error(error);
  }
  return value;
}

export function calculateBirthChart(
  data: BirthChartData,
  system: AstroSystem
): BirthChartResult {
  const { birthDate, birthTime, birthPlace, latitude, longitude } = data;

  debugLog("Starting birth chart calculation for", {
    birthDate, birthTime, birthPlace, latitude, longitude, system
  });

  // Parse local time
  const ukTerms = ["uk", "united kingdom", "england", "scotland", "wales", "northern ireland"];
  const isUKLocation = ukTerms.some(term => 
    birthPlace.toLowerCase().includes(term)
  );
  
  const timezone = isUKLocation ? "Europe/London" : birthPlace;
  const localTime = moment.tz(`${birthDate}T${birthTime}`, timezone);
  
  debugLog("Parsed Local Time", {
    formatted: localTime.format(),
    utc: localTime.utc().format(),
    jsDate: localTime.toDate(),
    zone: localTime.tz(),
    offset: localTime.utcOffset()
  });

  // Calculate Julian Days
  const year = localTime.year();
  const month = localTime.month() + 1;
  const day = localTime.date();
  const hour = localTime.hour();
  const minute = localTime.minute();
  const fractionOfDay = (hour + minute / 60) / 24;

  debugLog("Julian Day inputs", {
    year, month, day, hour, minute, fractionOfDay
  });

  const jdUT = julian.CalendarGregorianToJD(year, month, day + fractionOfDay);
  validateNumericValue(jdUT, "Julian Day UT");

  // Calculate Delta T using NASA's polynomial approximations
  const y = year + (month - 0.5) / 12;
  let deltaTsec;
  if (y < 1986) {
    const t = (y - 1950) / 100;
    deltaTsec = 29.07 + 40.7 * t - 42.2 * t * t - 41.4 * t * t * t;
  } else {
    const t = (y - 2000) / 100;
    deltaTsec = 63.86 + 33.45 * t - 603.74 * t * t + 1727.5 * t * t * t;
  }

  const jdTT = jdUT + deltaTsec / 86400;
  validateNumericValue(jdTT, "Julian Day TT");
  
  debugLog("Time conversion", {
    deltaTsec,
    jdUT,
    jdTT,
    difference: jdTT - jdUT
  });

  // Convert JD to JDE for nutation calculation
  const T = (jdTT - 2451545.0) / 36525; // Julian centuries since J2000.0
  const jde = jdTT + (0.000005 + 0.0000000155 * T) * T * T; // Convert to Ephemeris time
  
  debugLog("Pre-nutation calculation", { jdTT, jde, T });
  
  // Calculate nutation with JDE
  const nutResult = nutation.nutation(jde);
  
  // Validate raw radian values before conversion
  const dpsiRad = validateNumericValue(nutResult.dpsi, "Nutation dpsi (radians)");
  const depsRad = validateNumericValue(nutResult.deps, "Nutation deps (radians)");
  
  // Convert to degrees after validation
  const dpsi = dpsiRad * RAD_TO_DEG;
  const deps = depsRad * RAD_TO_DEG;

  const meanEpsRad = validateNumericValue(nutation.meanObliquity(jde), "Mean obliquity (radians)");
  const meanEps = meanEpsRad * RAD_TO_DEG;
  const epsTrue = meanEps + deps;
  validateNumericValue(epsTrue, "True obliquity");

  // Calculate positions with proper radian to degree conversion
  const sunLonRad = validateNumericValue(solar.apparentLongitude(jdTT), "Solar longitude (radians)");
  const sunLonTrop = sunLonRad * RAD_TO_DEG;
  
  const moonLonRad = validateNumericValue(moonposition.position(jdTT).lon, "Lunar longitude (radians)");
  const moonLonTrop = moonLonRad * RAD_TO_DEG;
  
  // Calculate ascendant with detailed validation
  const gastH = sidereal.apparent(jdUT);
  validateNumericValue(gastH, "GAST hours");
  
  const lstDeg = wrap360(gastH * 15 + longitude);
  const lstRad = lstDeg * DEG_TO_RAD;
  const latRad = latitude * DEG_TO_RAD;
  
  debugLog("Ascendant calculation inputs", {
    gastH,
    lstDeg,
    lstRad,
    latRad,
    epsTrueRad: epsTrue * DEG_TO_RAD
  });

  const cosLst = Math.cos(lstRad);
  const sinLst = Math.sin(lstRad);
  const cosEps = Math.cos(epsTrue * DEG_TO_RAD);
  const sinEps = Math.sin(epsTrue * DEG_TO_RAD);
  const tanLat = Math.tan(latRad);

  debugLog("Ascendant trig values", {
    cosLst, sinLst, cosEps, sinEps, tanLat
  });

  const numerator = cosLst;
  const denominator = -sinLst * cosEps + tanLat * sinEps;
  const ascRad = Math.atan2(numerator, denominator);
  const ascLonTrop = wrap360(ascRad * RAD_TO_DEG);
  
  debugLog("Raw tropical positions", {
    sunLonTrop,
    moonLonTrop,
    ascLonTrop
  });

  // Handle sidereal calculations
  let finalPositions;
  if (system === "sidereal") {
    const ayanamsa = approximateAyanamsa(year);
    finalPositions = {
      sunLon: wrap360(sunLonTrop - ayanamsa),
      moonLon: wrap360(moonLonTrop - ayanamsa),
      ascLon: wrap360(ascLonTrop - ayanamsa)
    };
    debugLog("Sidereal positions after ayanamsa", {
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

  debugLog(`Final ${system} positions`, {
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

function approximateAyanamsa(year: number) {
  const baseYear = 2000;
  const baseAyanamsa = 23.85;
  const yearsDiff = year - baseYear;
  const shiftDeg = yearsDiff * (50.27 / 3600); // More accurate annual precession
  const result = baseAyanamsa + shiftDeg;
  
  debugLog("Ayanamsa calculation", {
    year,
    yearsDiff,
    shiftDeg,
    result
  });
  
  return result;
}

function wrap360(deg: number) {
  const result = ((deg % 360) + 360) % 360;
  return validateNumericValue(result, "wrap360");
}

function extractSignDegrees(longitude: number) {
  debugLog("extractSignDegrees input", longitude);
  
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

  debugLog("Sign extraction", {
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
