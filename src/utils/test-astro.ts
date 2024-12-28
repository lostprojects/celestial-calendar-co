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

const getZodiacSign = (longitude: number): string => {
  // Adjust longitude to ensure it's between 0 and 360
  const adjustedLongitude = ((longitude % 360) + 360) % 360;
  
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  // Calculate sign index (0-11) based on 30-degree segments
  const signIndex = Math.floor(adjustedLongitude / 30);
  return signs[signIndex];
};

const calculateSunSign = (jd: number): string => {
  console.log("\n=== Sun Sign Calculation ===");
  
  const sunLongitude = (solar.apparentLongitude(jd) * 180 / Math.PI) + 180;
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
  const moonLongitude = (moonData.lon * 180 / Math.PI) + 180;
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
  
  // Convert to proper units and adjust calculations
  const localSiderealTime = (sidereal.apparent(jd) + longitude / 15) * 15;
  const ascendantLongitude = (localSiderealTime + 180) % 360;
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