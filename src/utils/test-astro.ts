import { julian, solar, moonposition, sidereal } from "astronomia";
import moment from "moment-timezone";

interface TestCase {
  birthDate: string;
  birthTime: string;
  timeZone: string;
  latitude?: number;
  longitude?: number;
}

const convertToUT = (date: string, time: string, timeZone: string) => {
  const localDateTime = `${date}T${time}:00`;
  const utcMoment = moment.tz(localDateTime, timeZone).utc();
  
  return {
    utcDate: utcMoment.format('YYYY-MM-DD'),
    utcTime: utcMoment.format('HH:mm')
  };
};

const calculateJulianDay = (date: string, time: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const fractionalDay = (hour + minute / 60) / 24;
  
  return julian.CalendarGregorianToJD(year, month, day + fractionalDay);
};

const getZodiacSign = (longitude: number): string => {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
};

const calculateSunSign = (jd: number): string => {
  const sunLongitude = solar.apparentLongitude(jd);
  return getZodiacSign(sunLongitude);
};

const calculateMoonSign = (jd: number): string => {
  const moonData = moonposition.position(jd);
  const eclipticLongitude = moonData.lon; // Apparent longitude in degrees
  return getZodiacSign(eclipticLongitude);
};

const calculateRisingSign = (jd: number, latitude: number, longitude: number): string => {
  // Convert longitude to hour angle (15° = 1 hour)
  const localSiderealTime = sidereal.apparent(jd) + longitude / 15;
  
  // Calculate ascendant using sidereal time and location
  const ascendantLongitude = (localSiderealTime * 15 + 180) % 360;
  return getZodiacSign(ascendantLongitude);
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

  console.log("Test Case Input:", {
    localDateTime: `${testCase.birthDate}T${testCase.birthTime}`,
    latitude: testCase.latitude,
    longitude: testCase.longitude,
    timeZone: testCase.timeZone
  });

  const utcConversion = convertToUT(
    testCase.birthDate,
    testCase.birthTime,
    testCase.timeZone
  );
  
  console.log("UTC Conversion:", utcConversion);
  
  const julianDay = calculateJulianDay(
    utcConversion.utcDate,
    utcConversion.utcTime
  );
  
  console.log("Julian Day Calculation:", {
    julianDay,
    expectedJD: 2444520.479167,
    isValid: Math.abs(julianDay - 2444520.479167) < 0.000001
  });

  const sunSign = calculateSunSign(julianDay);
  const moonSign = calculateMoonSign(julianDay);
  const risingSign = testCase.latitude && testCase.longitude ? 
    calculateRisingSign(julianDay, testCase.latitude, testCase.longitude) : 
    undefined;

  console.log("Astrological Signs:", {
    sunSign,
    moonSign,
    risingSign,
    validation: {
      sunSignMatch: sunSign === "Libra",
      moonSignMatch: moonSign === "Libra",
      risingSignMatch: risingSign === "Leo"
    }
  });

  console.log("\n=== Astrological Calculations Tests Complete ===\n");

  return {
    julianDay,
    signs: {
      sun: sunSign,
      moon: moonSign,
      rising: risingSign
    }
  };
};