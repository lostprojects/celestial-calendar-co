import { CalendarGregorianToJD } from "astronomia/julian";
import * as solar from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as coord from "astronomia/coord";
import * as sidereal from "astronomia/sidereal";
import moment from 'moment-timezone';

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
  // Parse input date/time
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  console.log("Input date/time:", {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
    rawInputs: { year, month, day, hour, minute }
  });

  // Create moment in local timezone (Europe/London)
  const localMoment = moment.tz([year, month - 1, day, hour, minute], "Europe/London");
  console.log("Local time (BST):", localMoment.format());
  
  // Convert to UTC
  const utcMoment = localMoment.utc();
  console.log("Converted UTC time:", utcMoment.format());
  
  // Calculate Julian Day using UTC components
  const jd = CalendarGregorianToJD(
    utcMoment.year(),
    utcMoment.month() + 1,
    utcMoment.date() + ((utcMoment.hours() + utcMoment.minutes() / 60.0) / 24.0)
  );
  
  // Calculate Julian Ephemeris Day (adding deltaT correction)
  const deltaT = 67.2; // Approximate value for 1980
  const jde = jd + deltaT / 86400;
  
  // Calculate Sun's apparent longitude (corrected)
  const sunLong = solar.apparentLongitude(jde);
  const sunLongDeg = (sunLong * 180 / Math.PI + 360) % 360;
  
  // Calculate Moon's position (corrected)
  const moonPos = getMoonPosition(jde);
  const moonLong = (moonPos.lon * 180 / Math.PI + 360) % 360;
  
  // Calculate RAMC (Right Ascension of Midheaven)
  const lst = sidereal.apparent(jde);
  const ramc = (lst * 180 / Math.PI + data.longitude + 360) % 360;
  
  // Calculate Ascendant using corrected formula
  const ascendant = calculateAscendant(ramc, data.latitude);
  
  // Convert positions to zodiac signs
  const sunPosition = getZodiacPosition(sunLongDeg);
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

function calculateAscendant(ramc: number, latitude: number): number {
  // Convert to radians
  const latRad = latitude * Math.PI / 180;
  const ramcRad = ramc * Math.PI / 180;
  const obliquityRad = 23.4367 * Math.PI / 180; // Mean obliquity for 1980
  
  // Calculate ascendant using the correct spherical trigonometry formula
  const tanAsc = -Math.cos(ramcRad) / 
                 (Math.sin(obliquityRad) * Math.tan(latRad) + 
                  Math.cos(obliquityRad) * Math.sin(ramcRad));
  
  let ascendant = Math.atan(tanAsc) * 180 / Math.PI;
  
  // Adjust quadrant based on RAMC
  if (ramc >= 180) {
    ascendant += 180;
  }
  
  // Normalize to 0-360 range
  return (ascendant + 360) % 360;
}

function getZodiacPosition(longitude: number) {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLong / 30);
  const totalDegrees = normalizedLong % 30;
  const degrees = Math.floor(totalDegrees);
  const minutes = Math.floor((totalDegrees - degrees) * 60);
  
  return {
    sign: signs[signIndex],
    degrees,
    minutes
  };
}