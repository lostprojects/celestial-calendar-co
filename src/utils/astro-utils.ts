import { DateToJD } from "astronomia/julian";
import * as solarCalc from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";

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
  // Parse date and time
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  // Create a Date object for the birth date and time
  const birthDate = new Date(year, month - 1, day, hour, minute);
  
  // Calculate Julian Day
  const jd = DateToJD(birthDate);
  
  // Calculate Julian Ephemeris Day (JDE)
  const deltaT = 67.2; // ΔT value for 1980
  const jde = jd + deltaT / 86400;
  
  // Calculate Sun position using solarCalc.true()
  const sunLong = solarCalc.true(jde);
  
  // Calculate Moon position
  const moonLong = getMoonPosition(jde).lon;
  
  // Calculate Ascendant (placeholder - actual calculation needed)
  const ascendant = calculateAscendant(jde, data.latitude, data.longitude);
  
  // Convert to zodiac signs and degrees
  const sunPosition = getZodiacPosition(sunLong);
  const moonPosition = getZodiacPosition(moonLong);
  const ascPosition = getZodiacPosition(ascendant);
  
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

function calculateAscendant(jde: number, lat: number, long: number): number {
  // Placeholder for ascendant calculation
  // This needs proper implementation based on astronomical algorithms
  return 0;
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