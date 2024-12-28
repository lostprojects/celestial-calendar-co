import { julian, solar, moonposition, sidereal } from "astronomia";
import moment from "moment-timezone";

interface TestCase {
  birthDate: string;
  birthTime: string;
  timeZone: string;
  latitude?: number;
  longitude?: number;
}

const normalizeLongitude = (longitude: number): number => {
  return (longitude % 360 + 360) % 360;
};

const convertToUT = (date: string, time: string, timeZone: string) => {
  console.log("\n=== UTC Conversion Function ===");
  console.log("Input:", { date, time, timeZone });
  
  // Create a moment object in the specified timezone
  const localDateTime = moment.tz(`${date} ${time}`, "YYYY-MM-DD HH:mm", timeZone);
  
  // Convert to UTC
  const utcDateTime = localDateTime.utc();
  
  const result = {
    utcDate: utcDateTime.format('YYYY-MM-DD'),
    utcTime: utcDateTime.format('HH:mm'),
    utcTimestamp: utcDateTime.valueOf()
  };
  
  console.log("Output:", result);
  return result;
};

const calculateJulianDay = (date: string, time: string) => {
  console.log("\n=== Julian Day Calculation ===");
  console.log("Input:", { date, time });
  
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  
  // Calculate decimal day (UTC)
  const fractionalDay = day + (hour + minute / 60) / 24;
  
  const jd = julian.CalendarGregorianToJD(year, month, fractionalDay);
  console.log("Output:", { julianDay: jd });
  return jd;
};

const getZodiacSign = (longitude: number): string => {
  console.log("\n=== Zodiac Sign Calculation ===");
  console.log("Input longitude:", longitude);
  
  const normalizedLongitude = normalizeLongitude(longitude);
  console.log("Normalized longitude:", normalizedLongitude);
  
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const signIndex = Math.floor(normalizedLongitude / 30);
  const result = signs[signIndex];
  
  console.log("Final sign:", result);
  return result;
};

const calculateSunSign = (jd: number): string => {
  console.log("\n=== Sun Sign Calculation ===");
  console.log("Input Julian Day:", jd);
  
  // Get tropical longitude
  const sunLongitude = solar.apparentLongitude(jd);
  const normalizedLongitude = normalizeLongitude(sunLongitude);
  console.log("Tropical Sun Longitude:", normalizedLongitude);
  
  const sunSign = getZodiacSign(normalizedLongitude);
  console.log("Final Sun Sign:", sunSign);
  
  return sunSign;
};

const calculateMoonSign = (jd: number): string => {
  console.log("\n=== Moon Sign Calculation ===");
  console.log("Input Julian Day:", jd);
  
  // Get tropical longitude from position()
  const moonData = moonposition.position(jd);
  const normalizedLongitude = normalizeLongitude(moonData.lon);
  console.log("Tropical Moon Longitude:", normalizedLongitude);
  
  const moonSign = getZodiacSign(normalizedLongitude);
  console.log("Final Moon Sign:", moonSign);
  
  return moonSign;
};

const calculateRisingSign = (jd: number, latitude: number, longitude: number): string => {
  console.log("\n=== Rising Sign Calculation ===");
  console.log("Input:", { julianDay: jd, latitude, longitude });
  
  // Calculate GMST (Greenwich Mean Sidereal Time)
  const gmst = sidereal.apparent(jd);
  console.log("GMST (hours):", gmst);
  
  // Convert GMST to degrees and add local longitude
  const ramc = normalizeLongitude((gmst * 15) + longitude);
  console.log("RAMC (degrees):", ramc);
  
  // Calculate obliquity of the ecliptic
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
  const epsilon = 23.43929111 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  console.log("Obliquity:", epsilon);
  
  // Calculate Ascendant using the standard formula for tropical calculations
  const tanAsc = Math.cos(ramc * Math.PI / 180) / 
    (Math.sin(latitude * Math.PI / 180) * Math.tan(epsilon * Math.PI / 180) - 
     Math.cos(latitude * Math.PI / 180) * Math.sin(ramc * Math.PI / 180));
  
  let ascendant = Math.atan(tanAsc) * 180 / Math.PI;
  
  // Adjust quadrant based on RAMC
  if (ramc > 180) {
    ascendant += 180;
  }
  ascendant = normalizeLongitude(ascendant);
  
  console.log("Calculated values:", {
    epsilon,
    ramc,
    ascendant
  });
  
  const risingSign = getZodiacSign(ascendant);
  console.log("Final Rising Sign:", risingSign);
  
  return risingSign;
};

export const runTests = () => {
  console.log("\n=== Starting Astrological Calculations Tests ===\n");
  
  const testCase: TestCase = {
    birthDate: "1980-10-14",
    birthTime: "00:30",
    timeZone: "Europe/London",
    latitude: 52.0567,
    longitude: 1.1482
  };

  // Convert local time to UTC
  const utcDateTime = convertToUT(
    testCase.birthDate,
    testCase.birthTime,
    testCase.timeZone
  );
  
  // Calculate Julian Day from UTC time
  const julianDay = calculateJulianDay(
    utcDateTime.utcDate,
    utcDateTime.utcTime
  );
  
  const sunSign = calculateSunSign(julianDay);
  const moonSign = calculateMoonSign(julianDay);
  const risingSign = testCase.latitude && testCase.longitude ? 
    calculateRisingSign(julianDay, testCase.latitude, testCase.longitude) : 
    undefined;

  console.log("\n=== Final Results ===");
  console.log("Calculated Signs:", {
    sun: sunSign,
    moon: moonSign,
    rising: risingSign
  });

  return {
    julianDay,
    signs: {
      sun: sunSign,
      moon: moonSign,
      rising: risingSign
    }
  };
};