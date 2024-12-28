import { julian, solar, moonposition, sidereal, coord } from "astronomia";
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
  // Normalize to 0-360 range for tropical zodiac
  const normalizedLong = ((longitude % 360) + 360) % 360;
  
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const signIndex = Math.floor(normalizedLong / 30);
  return signs[signIndex];
};

const calculateSunSign = (jd: number): string => {
  console.log("\n=== Sun Sign Calculation ===");
  
  // Get true solar coordinates (already in tropical zodiac)
  const sunCoord = solar.true(jd);
  const sunLongitude = (sunCoord.lon * 180 / Math.PI);
  const sunSign = getZodiacSign(sunLongitude);
  
  console.log("Output:", { 
    sunLongitude,
    sunSign 
  });
  return sunSign;
};

const calculateMoonSign = (jd: number): string => {
  console.log("\n=== Moon Sign Calculation ===");
  
  // Get lunar position (already in tropical zodiac)
  const moonCoord = moonposition.position(jd);
  const moonLongitude = (moonCoord.lon * 180 / Math.PI);
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
  
  // Convert latitude/longitude to radians
  const latRad = latitude * Math.PI / 180;
  const longRad = longitude * Math.PI / 180;
  
  // Calculate Local Sidereal Time
  const lst = sidereal.apparent(jd);
  // Convert LST to degrees and adjust for location
  const lstDeg = (lst * 180 / Math.PI * 15) + longitude;
  
  // Calculate Ascendant using obliquity of ecliptic
  const obliquity = 23.4367 * Math.PI / 180; // Mean obliquity for J2000
  const ascendantRad = Math.atan2(
    Math.cos(obliquity) * Math.sin(lstDeg * Math.PI / 180),
    Math.cos(lstDeg * Math.PI / 180)
  );
  
  const ascendantDeg = (ascendantRad * 180 / Math.PI + 360) % 360;
  const risingSign = getZodiacSign(ascendantDeg);
  
  console.log("Output:", { 
    localSiderealTime: lstDeg,
    ascendantLongitude: ascendantDeg,
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