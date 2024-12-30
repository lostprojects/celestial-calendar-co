import { DateToJD } from "astronomia/julian";
import * as solarCalc from "astronomia/solar";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as coord from "astronomia/coord";
import * as base from "astronomia/base";
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
  
  // Get timezone for the birth location
  const timezone = moment.tz.zone(moment.tz.guess(data.latitude, data.longitude));
  if (!timezone) {
    console.error("Could not determine timezone for location:", data.latitude, data.longitude);
    throw new Error("Could not determine timezone for the given location");
  }
  console.log("Determined timezone:", timezone.name);

  // Create moment object in the local timezone
  const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone.name);
  console.log("Local time:", localMoment.format());
  
  // Convert to UTC (this automatically handles DST)
  const utcMoment = localMoment.utc();
  console.log("UTC time:", utcMoment.format());
  
  // Create UTC date object for astronomia calculations
  const date = utcMoment.toDate();
  console.log("UTC Date object:", date);
  
  // Calculate Julian Day (JD)
  const jd = DateToJD(date);
  console.log("Julian Day:", jd);
  
  // Calculate Julian Ephemeris Day (JDE)
  // JDE accounts for ΔT (difference between UT1 and TT)
  const deltaT = 67.2; // ΔT value for year 2000 (approximate)
  const jde = jd + deltaT / 86400;
  console.log("Julian Ephemeris Day:", jde);
  
  // Calculate Sun's apparent longitude (in radians)
  const sunLongRad = solarCalc.apparentLongitude(jde);
  // Convert to degrees
  const sunLong = base.rad2deg(sunLongRad);
  console.log("Sun apparent longitude (degrees):", sunLong);
  
  // Calculate Moon's position (returns position in radians)
  const moonPos = getMoonPosition(jde);
  // Convert to degrees
  const moonLong = base.rad2deg(moonPos.lon);
  console.log("Moon longitude (degrees):", moonLong);
  
  // Calculate Ascendant (Rising Sign)
  const ascendant = calculateAscendant(jde, data.latitude, data.longitude);
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

function calculateAscendant(jde: number, lat: number, long: number): number {
  // Calculate Local Sidereal Time (LST)
  // LST is the hour angle of the vernal equinox
  const T = (jde - 2451545.0) / 36525; // Julian centuries since J2000.0
  const theta0 = 280.46061837 + 360.98564736629 * (jde - 2451545.0) +
                 0.000387933 * T * T - T * T * T / 38710000;
  
  // Adjust for longitude (east positive)
  const lst = (theta0 + long) % 360;
  console.log("Local Sidereal Time:", lst);
  
  // Calculate obliquity of the ecliptic
  const obliqRad = coord.obliquity(jde);
  const obliq = base.rad2deg(obliqRad);
  
  // Convert latitude to radians for trig functions
  const latRad = base.deg2rad(lat);
  const lstRad = base.deg2rad(lst);
  
  // Calculate ascendant using spherical trigonometry
  const tanAsc = Math.sin(lstRad) /
                 (Math.cos(lstRad) * Math.cos(obliqRad) -
                  Math.tan(latRad) * Math.sin(obliqRad));
  
  let ascendant = base.rad2deg(Math.atan(tanAsc));
  
  // Adjust quadrant based on LST
  if (lst > 180) {
    ascendant += 180;
  } else if (lst > 0 && ascendant < 0) {
    ascendant += 360;
  }
  
  return ascendant;
}

function calculateAyanamsa(jde: number): number {
  // Lahiri ayanamsa calculation
  const T = (jde - 2451545.0) / 36525;
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