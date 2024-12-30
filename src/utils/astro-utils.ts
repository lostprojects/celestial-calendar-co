import { julian, solar, moonposition, nutation, sidereal } from "astronomia";
import moment from "moment-timezone";
import { stringify } from "flatted";

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

interface SignDegrees {
  sign: string;
  degrees: number;
  minutes: number;
}

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export function calculateBirthChart(
  data: BirthChartData,
  system: AstroSystem = "tropical"
): BirthChartResult {
  const { birthDate, birthTime, birthPlace, latitude, longitude } = data;

  const inputData = {
    birthDate,
    birthTime,
    birthPlace,
    latitude,
    longitude
  };
  console.log(`Calculating ${system} birth chart with:`, stringify(inputData));

  const timezone = birthPlace.toLowerCase().includes("uk") 
    ? "Europe/London" 
    : moment.tz.guess();
  
  const localTime = moment.tz(`${birthDate}T${birthTime}`, timezone);
  
  const timeData = {
    formatted: localTime.format(),
    utc: localTime.utc().format(),
    jsDate: localTime.toDate().toISOString(),
    zone: localTime.tz()
  };
  console.log("Parsed Local Time:", stringify(timeData));

  const jdUT = julian.DateToJD(localTime.toDate());
  const jdTT = jdUT + (37 + 32.184) / 86400;

  const sunLonTrop = solar.apparentLongitude(jdTT);
  const moonLonTrop = moonposition.position(jdTT).lon;
  const ascLonTrop = calcAscendant(jdUT, latitude, longitude);
  
  const tropicalData = {
    sunLonTrop,
    moonLonTrop,
    ascLonTrop
  };
  console.log("Tropical positions:", stringify(tropicalData));

  let finalPositions;
  if (system === "sidereal") {
    const ayanamsa = sidereal.krishnamurti(jdUT);
    finalPositions = {
      sunLon: wrap360(sunLonTrop - ayanamsa),
      moonLon: wrap360(moonLonTrop - ayanamsa),
      ascLon: wrap360(ascLonTrop - ayanamsa)
    };
    
    const siderealData = {
      ayanamsa,
      ...finalPositions
    };
    console.log("Sidereal positions after ayanamsa:", stringify(siderealData));
  } else {
    finalPositions = {
      sunLon: sunLonTrop,
      moonLon: moonLonTrop,
      ascLon: ascLonTrop
    };
  }

  const sunObj = extractSignDegrees(finalPositions.sunLon);
  const moonObj = extractSignDegrees(finalPositions.moonLon);
  const ascObj = extractSignDegrees(finalPositions.ascLon);

  const finalData = {
    sun: sunObj,
    moon: moonObj,
    asc: ascObj
  };
  console.log(`Final ${system} positions:`, stringify(finalData));

  return {
    sunSign: sunObj.sign,
    sunDeg: sunObj.degrees,
    sunMin: sunObj.minutes,
    moonSign: moonObj.sign,
    moonDeg: moonObj.degrees,
    moonMin: moonObj.minutes,
    risingSign: ascObj.sign,
    risingDeg: ascObj.degrees,
    risingMin: ascObj.minutes,
  };
}

function wrap360(degrees: number): number {
  degrees = degrees % 360;
  return degrees < 0 ? degrees + 360 : degrees;
}

function extractSignDegrees(longitude: number): SignDegrees {
  longitude = wrap360(longitude);
  const signIndex = Math.floor(longitude / 30);
  const degrees = Math.floor(longitude % 30);
  const minutes = Math.floor((longitude % 1) * 60);
  
  return {
    sign: SIGNS[signIndex],
    degrees,
    minutes
  };
}

function calcAscendant(jd: number, lat: number, lng: number): number {
  const SIDEREAL_RATE = 360.98564736629;
  const J2000 = 2451545.0;
  
  // Convert longitude to hour angle
  const lst = (jd - J2000) * SIDEREAL_RATE;
  const ha = wrap360(lst + lng);
  
  // Calculate ascendant
  const latRad = lat * Math.PI / 180;
  const haRad = ha * Math.PI / 180;
  
  const ascRad = Math.atan2(
    Math.cos(haRad),
    -(Math.sin(haRad) * Math.cos(23.4393 * Math.PI / 180) +
      Math.tan(latRad) * Math.sin(23.4393 * Math.PI / 180))
  );
  
  return wrap360(ascRad * 180 / Math.PI);
}