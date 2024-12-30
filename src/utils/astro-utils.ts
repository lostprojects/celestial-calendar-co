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
  console.log("Calculating birth chart with data:", data);
  
  // Parse date and time from local input
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  // Get timezone for the birth location using tzMoment.guess()
  // This will use the browser's timezone detection
  const timezone = moment.tz.guess();
  if (!timezone) {
    console.error("Could not determine timezone");
    throw new Error("Could not determine timezone");
  }
  console.log("Determined timezone:", timezone);

  // Create moment object in the local timezone
  const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone);
  console.log("Local time:", localMoment.format());
  
  // Convert to UTC (this automatically handles DST)
  const utcMoment = localMoment.utc();
  console.log("UTC time:", utcMoment.format());
  
  // Create UTC date object for astronomia calculations
  const date = utcMoment.toDate();
  console.log("UTC Date object:", date);
  
  // Calculate Julian Day using CalendarGregorianToJD
  const jd = CalendarGregorianToJD(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate() + 
    (date.getUTCHours() + 
    date.getUTCMinutes() / 60.0) / 24.0
  );
  console.log("Julian Day:", jd);
  
  // Calculate Julian Ephemeris Day (JDE)
  const deltaT = 67.2; // ΔT value for year 2000 (approximate)
  const jde = jd + deltaT / 86400;
  console.log("Julian Ephemeris Day:", jde);
  
  // Calculate Sun's apparent longitude
  const sunLong = solar.apparentLongitude(jde) * 180 / Math.PI;
  console.log("Sun apparent longitude (degrees):", sunLong);
  
  // Calculate Moon's position
  const moonPos = getMoonPosition(jde);
  const moonLong = moonPos.lon * 180 / Math.PI;
  console.log("Moon longitude (degrees):", moonLong);
  
  // Calculate Ascendant using sidereal time and geographic coordinates
  const lst = sidereal.apparent(jde) * 180 / Math.PI;
  const ascendant = calculateAscendant(lst, data.latitude, data.longitude);
  console.log("Ascendant (degrees):", ascendant);
  
  // Apply ayanamsa correction for sidereal calculations
  const ayanamsa = system === "sidereal" ? calculateAyanamsa(jde) : 0;
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

function calculateAscendant(lst: number, lat: number, long: number): number {
  // Convert to radians for trigonometric calculations
  const latRad = lat * Math.PI / 180;
  const lstRad = (lst + long) * Math.PI / 180;
  
  // Calculate obliquity of the ecliptic
  const obliqRad = 23.4367 * Math.PI / 180; // Mean obliquity for J2000.0
  
  // Calculate ascendant using spherical trigonometry
  const tanAsc = Math.sin(lstRad) /
                 (Math.cos(lstRad) * Math.cos(obliqRad) -
                  Math.tan(latRad) * Math.sin(obliqRad));
  
  let ascendant = Math.atan(tanAsc) * 180 / Math.PI;
  
  // Adjust quadrant based on LST
  if (lst + long > 180) {
    ascendant += 180;
  } else if (lst + long > 0 && ascendant < 0) {
    ascendant += 360;
  }
  
  return (ascendant + 360) % 360;
}

function calculateAyanamsa(jde: number): number {
  // Lahiri ayanamsa calculation
  const T = (jde - 2451545.0) / 36525;
  return 23.85 + 0.0137 * T;
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