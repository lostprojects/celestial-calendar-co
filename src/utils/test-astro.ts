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
  // Only normalize at the end to ensure we keep the correct tropical longitude
  return (longitude % 360 + 360) % 360;
};

const convertToUT = (date: string, time: string, timeZone: string) => {
  console.log("\n=== UTC Conversion Function ===");
  console.log("Input:", { date, time, timeZone });
  
  const localDateTime = `${date}T${time}:00`;
  const utcMoment = moment.tz(localDateTime, timeZone).utc();
  
  const result = {
    utcDate: utcMoment.format('YYYY-MM-DD'),
    utcTime: utcMoment.format('HH:mm')
  };
  
  console.log("Output:", result);
  return result;
};

const calculateJulianDay = (date: string, time: string) => {
  console.log("\n=== Julian Day Calculation ===");
  console.log("Input:", { date, time });
  
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const fractionalDay = (hour + minute / 60) / 24;
  
  const jd = julian.CalendarGregorianToJD(year, month, day + fractionalDay);
  console.log("Output:", { julianDay: jd });
  return jd;
};

const getZodiacSign = (longitude: number): string => {
  console.log("\n=== Zodiac Sign Calculation ===");
  console.log("Input longitude:", longitude);
  
  // Normalize the longitude only at the final step
  const normalizedLongitude = normalizeLongitude(longitude);
  console.log("Normalized longitude for zodiac:", normalizedLongitude);
  
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const signIndex = Math.floor(normalizedLongitude / 30);
  const result = signs[signIndex];
  
  console.log("Zodiac calculation:", {
    normalizedLongitude,
    signIndex,
    result
  });
  
  return result;
};

const calculateSunSign = (jd: number): string => {
  console.log("\n=== Sun Sign Calculation ===");
  console.log("Input Julian Day:", jd);
  
  // solar.apparentLongitude() already returns tropical longitude
  const sunLongitude = solar.apparentLongitude(jd);
  console.log("Tropical Sun Longitude:", sunLongitude);
  
  const sunSign = getZodiacSign(sunLongitude);
  console.log("Final Sun Sign:", sunSign);
  
  return sunSign;
};

const calculateMoonSign = (jd: number): string => {
  console.log("\n=== Moon Sign Calculation ===");
  console.log("Input Julian Day:", jd);
  
  // moonposition.position() returns tropical coordinates
  const moonData = moonposition.position(jd);
  console.log("Tropical Moon Longitude:", moonData.lon);
  
  const moonSign = getZodiacSign(moonData.lon);
  console.log("Final Moon Sign:", moonSign);
  
  return moonSign;
};

const calculateRisingSign = (jd: number, latitude: number, longitude: number): string => {
  console.log("\n=== Rising Sign Calculation ===");
  console.log("Input:", { 
    julianDay: jd,
    latitude,
    longitude 
  });
  
  // Calculate RAMC (Right Ascension of the Mid-Heaven)
  const localSiderealTime = sidereal.apparent(jd);
  const RAMC = localSiderealTime * 15; // Convert to degrees
  
  // Calculate obliquity of the ecliptic
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
  const epsilon = 23.43929111 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  
  // Calculate ascendant using the standard formula for tropical calculations
  const ascendantRadians = Math.atan2(
    Math.cos(RAMC * Math.PI / 180),
    -(Math.sin(RAMC * Math.PI / 180) * Math.cos(epsilon * Math.PI / 180) +
      Math.tan(latitude * Math.PI / 180) * Math.sin(epsilon * Math.PI / 180))
  );
  
  // Convert to degrees and normalize
  let ascendantDegrees = ascendantRadians * 180 / Math.PI;
  ascendantDegrees = normalizeLongitude(ascendantDegrees);
  
  console.log("Calculated values:", {
    RAMC,
    epsilon,
    ascendantDegrees
  });
  
  const risingSign = getZodiacSign(ascendantDegrees);
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

  const utcConversion = convertToUT(
    testCase.birthDate,
    testCase.birthTime,
    testCase.timeZone
  );
  
  const julianDay = calculateJulianDay(
    utcConversion.utcDate,
    utcConversion.utcTime
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

  const results = {
    julianDay,
    signs: {
      sun: sunSign,
      moon: moonSign,
      rising: risingSign
    }
  };

  console.log("Final results object:", results);
  return results;
};
