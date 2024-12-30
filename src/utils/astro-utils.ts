import { DateToJD } from "astronomia/julian";
import * as solarCalc from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as coord from "astronomia/coord";
import * as base from "astronomia/base";

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

export function calculateBirthChart(data: BirthChartData, system: "tropical" | "sidereal"): BirthChartResult {
  console.log("Calculating birth chart with data:", data);
  
  // Parse date and time
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  // Create base object for astronomia calculations
  const t = base.julian(year, month, day, hour + minute/60);
  console.log("Time object created:", t);
  
  // Calculate Julian Day
  const jd = DateToJD(t);
  console.log("Julian Day:", jd);
  
  // Calculate Julian Ephemeris Day (JDE)
  const deltaT = 67.2; // ΔT value for year 2000 (should be calculated based on year)
  const jde = jd + deltaT / 86400;
  console.log("Julian Ephemeris Day:", jde);
  
  // Calculate Sun position
  const sunLong = solarCalc.apparentLongitude(t);
  console.log("Sun apparent longitude:", sunLong);
  
  // Calculate Moon position
  const moonPos = getMoonPosition(t);
  const moonLong = moonPos.lon;
  console.log("Moon longitude:", moonLong);
  
  // Calculate Ascendant (Rising Sign)
  const ascendant = calculateAscendant(t, data.latitude, data.longitude);
  console.log("Ascendant:", ascendant);
  
  // Apply ayanamsa correction for sidereal calculations
  const ayanamsa = system === "sidereal" ? calculateAyanamsa(t) : 0;
  console.log("Ayanamsa correction:", ayanamsa);
  
  // Convert to zodiac positions
  const sunPosition = getZodiacPosition(sunLong - ayanamsa);
  const moonPosition = getZodiacPosition(moonLong - ayanamsa);
  const ascPosition = getZodiacPosition(ascendant - ayanamsa);
  
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

function calculateAscendant(t: any, lat: number, long: number): number {
  // Local Sidereal Time calculation
  const jd = DateToJD(t);
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
  const theta0 = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
                 0.000387933 * T * T - T * T * T / 38710000;
  
  // Adjust for longitude
  const lst = (theta0 + long) % 360;
  console.log("Local Sidereal Time:", lst);
  
  // Calculate ascendant using Placidus house system
  const obliq = coord.obliquity(t);
  const tanAsc = Math.sin(lst * Math.PI / 180) /
                 (Math.cos(lst * Math.PI / 180) * Math.cos(obliq * Math.PI / 180) -
                  Math.tan(lat * Math.PI / 180) * Math.sin(obliq * Math.PI / 180));
  
  let ascendant = Math.atan(tanAsc) * 180 / Math.PI;
  
  // Adjust quadrant based on LST
  if (lst > 180) {
    ascendant += 180;
  } else if (lst > 0 && ascendant < 0) {
    ascendant += 360;
  }
  
  return ascendant;
}

function calculateAyanamsa(t: any): number {
  // Lahiri ayanamsa calculation
  const jd = DateToJD(t);
  const T = (jd - 2451545.0) / 36525;
  return 23.85 + 0.0137 * T; // Simplified Lahiri ayanamsa
}

function getZodiacPosition(longitude: number) {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  // Normalize longitude to 0-360 range
  const normalizedLong = ((longitude % 360) + 360) % 360;
  
  // Calculate sign index (0-11)
  const signIndex = Math.floor(normalizedLong / 30);
  
  // Calculate degrees and minutes within sign
  const totalDegrees = normalizedLong % 30;
  const degrees = Math.floor(totalDegrees);
  const minutes = Math.floor((totalDegrees - degrees) * 60);
  
  return {
    sign: signs[signIndex],
    degrees,
    minutes
  };
}