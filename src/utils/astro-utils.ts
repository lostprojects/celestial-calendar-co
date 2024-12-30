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
  // Detailed timezone logging
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  console.log("Input date/time:", {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
    rawInputs: { year, month, day, hour, minute }
  });

  // Create moment object in local timezone
  const localMoment = moment.tz([year, month - 1, day, hour, minute], "Europe/London");
  console.log("Local time (BST):", localMoment.format());
  
  // Convert to UTC
  const utcMoment = localMoment.utc();
  console.log("Converted UTC time:", utcMoment.format());
  
  // Calculate fractional day
  const utcHour = utcMoment.hours();
  const utcMinute = utcMoment.minutes();
  const fractionalDay = (utcHour + utcMinute / 60.0) / 24.0;
  console.log("UTC time components:", {
    hour: utcHour,
    minute: utcMinute,
    fractionalDay
  });

  // Calculate Julian Day
  const jd = CalendarGregorianToJD(
    utcMoment.year(),
    utcMoment.month() + 1,
    utcMoment.date() + fractionalDay
  );
  
  console.log("Julian Day calculation:", {
    year: utcMoment.year(),
    month: utcMoment.month() + 1,
    day: utcMoment.date(),
    fractionalDay,
    julianDay: jd
  });
  
  // Calculate Julian Ephemeris Day
  const deltaT = 67.2;
  const jde = jd + deltaT / 86400;
  console.log("Julian Ephemeris Day calculation:", {
    julianDay: jd,
    deltaT,
    julianEphemerisDay: jde
  });

  // Calculate Sun's position
  const sunLong = solar.apparentLongitude(jde) * 180 / Math.PI;
  console.log("Sun apparent longitude (degrees):", sunLong);
  
  // Calculate Moon's position
  const moonPos = getMoonPosition(jde);
  const moonLong = moonPos.lon * 180 / Math.PI;
  const moonLat = moonPos.lat * 180 / Math.PI;
  console.log("Moon position:", {
    longitude: moonLong,
    latitude: moonLat
  });
  
  // Calculate Ascendant
  const lst = sidereal.apparent(jde) * 180 / Math.PI;
  console.log("Local Sidereal Time (degrees):", lst);
  
  const ascendant = calculateAscendant(lst, data.latitude, data.longitude);
  console.log("Raw Ascendant (degrees):", ascendant);
  
  // Apply ayanamsa correction for sidereal calculations
  const ayanamsa = system === "sidereal" ? calculateAyanamsa(jde) : 0;
  console.log("Ayanamsa correction:", ayanamsa);
  
  // Convert to zodiac positions
  const sunPosition = getZodiacPosition(sunLong - ayanamsa);
  const moonPosition = getZodiacPosition(moonLong - ayanamsa);
  const ascPosition = getZodiacPosition(ascendant - ayanamsa);
  
  console.log("Final zodiac positions:", {
    sun: { sign: sunPosition.sign, deg: sunPosition.degrees, min: sunPosition.minutes },
    moon: { sign: moonPosition.sign, deg: moonPosition.degrees, min: moonPosition.minutes },
    rising: { sign: ascPosition.sign, deg: ascPosition.degrees, min: ascPosition.minutes }
  });

  // Add logging for final positions
  console.log("Final calculated positions:", {
    sun: { sign: sunPosition.sign, deg: sunPosition.degrees, min: sunPosition.minutes },
    moon: { sign: moonPosition.sign, deg: moonPosition.degrees, min: moonPosition.minutes },
    asc: { sign: ascPosition.sign, deg: ascPosition.degrees, min: ascPosition.minutes },
    system,
    ayanamsa: system === "sidereal" ? calculateAyanamsa(jde) : 0
  });

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
  console.log("Calculating Ascendant with inputs:", {
    localSiderealTime: lst,
    latitude: lat,
    longitude: long
  });
  
  const latRad = lat * Math.PI / 180;
  const lstRad = (lst + long) * Math.PI / 180;
  const obliqRad = 23.4367 * Math.PI / 180;
  
  const tanAsc = Math.sin(lstRad) /
                 (Math.cos(lstRad) * Math.cos(obliqRad) -
                  Math.tan(latRad) * Math.sin(obliqRad));
  
  let ascendant = Math.atan(tanAsc) * 180 / Math.PI;
  
  if (lst + long > 180) {
    ascendant += 180;
  } else if (lst + long > 0 && ascendant < 0) {
    ascendant += 360;
  }
  
  ascendant = (ascendant + 360) % 360;
  
  console.log("Ascendant calculation steps:", {
    tanAscendant: tanAsc,
    rawAscendant: ascendant
  });
  
  return ascendant;
}

function calculateAyanamsa(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  const ayanamsa = 23.85 + 0.0137 * T;
  console.log("Calculated Ayanamsa:", ayanamsa);
  return ayanamsa;
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
  
  console.log("Zodiac position calculation:", {
    inputLongitude: longitude,
    normalizedLongitude: normalizedLong,
    signIndex,
    sign: signs[signIndex],
    degrees,
    minutes
  });
  
  return {
    sign: signs[signIndex],
    degrees,
    minutes
  };
}
