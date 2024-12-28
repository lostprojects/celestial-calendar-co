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
  console.log("Normalizing longitude:", longitude);
  const normalized = (longitude % 360 + 360) % 360;
  console.log("Normalized result:", normalized);
  return normalized;
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
  
  const normalizedLongitude = normalizeLongitude(longitude);
  console.log("Normalized longitude for zodiac:", normalizedLongitude);
  
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const signIndex = Math.floor(normalizedLongitude / 30) % 12;
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
  
  const rawSunLongitude = solar.apparentLongitude(jd);
  console.log("Raw Sun Longitude:", rawSunLongitude);
  
  const sunSign = getZodiacSign(rawSunLongitude);
  console.log("Final Sun Sign:", sunSign);
  
  return sunSign;
};

const calculateMoonSign = (jd: number): string => {
  console.log("\n=== Moon Sign Calculation ===");
  console.log("Input Julian Day:", jd);
  
  const moonData = moonposition.position(jd);
  console.log("Raw Moon Longitude:", moonData.lon);
  
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
  
  // Calculate tropical ascendant using local sidereal time
  const localSiderealTime = sidereal.apparent(jd);
  console.log("Local Sidereal Time:", localSiderealTime);
  
  // Convert to tropical longitude (this is the key change)
  const rawAscendantLongitude = (localSiderealTime * 15 + longitude + 180) % 360;
  console.log("Raw Ascendant Longitude:", rawAscendantLongitude);
  
  const risingSign = getZodiacSign(rawAscendantLongitude);
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