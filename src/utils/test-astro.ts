import { julian, solar, moonposition, sidereal } from "astronomia";
import moment from "moment-timezone";

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

const normalizeAngle = (angle: number): number => {
  return ((angle % 360) + 360) % 360;
};

const getZodiacSign = (longitude: number): string => {
  const normalizedLongitude = normalizeAngle(longitude);
  
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const signIndex = Math.floor(normalizedLongitude / 30);
  return signs[signIndex];
};

const calculateSunSign = (jd: number): string => {
  console.log("\n=== Sun Sign Calculation ===");
  
  const sunLongitude = normalizeAngle((solar.apparentLongitude(jd) * 180 / Math.PI));
  const sunSign = getZodiacSign(sunLongitude);
  
  console.log("Output:", { 
    sunLongitude,
    sunSign 
  });
  return sunSign;
};

const calculateMoonSign = (jd: number): string => {
  console.log("\n=== Moon Sign Calculation ===");
  
  const moonData = moonposition.position(jd);
  const moonLongitude = normalizeAngle((moonData.lon * 180 / Math.PI));
  const moonSign = getZodiacSign(moonLongitude);
  
  console.log("Output:", { 
    moonLongitude,
    moonSign 
  });
  return moonSign;
};

const calculateRisingSign = (jd: number, latitude: number, longitude: number): string => {
  console.log("\n=== Rising Sign Calculation ===");
  console.log("Input:", { 
    julianDay: jd,
    latitude,
    longitude 
  });
  
  const siderealTime = sidereal.apparent(jd);
  const localSiderealTime = normalizeAngle(siderealTime * 15 + longitude);
  const ascendantLongitude = normalizeAngle(localSiderealTime + 180);
  const risingSign = getZodiacSign(ascendantLongitude);
  
  console.log("Output:", { 
    localSiderealTime,
    ascendantLongitude,
    risingSign 
  });
  return risingSign;
};

export const runTests = () => {
  console.log("\n=== Starting Astrological Calculations Tests ===\n");
  
  const testCase = {
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
  
  const julianDay = calculateJulianDay(
    utcConversion.utcDate,
    utcConversion.utcTime
  );
  
  const sunSign = calculateSunSign(julianDay);
  const moonSign = calculateMoonSign(julianDay);
  const risingSign = calculateRisingSign(julianDay, testCase.latitude, testCase.longitude);

  return {
    julianDay,
    signs: {
      sun: sunSign,
      moon: moonSign,
      rising: risingSign
    }
  };
};