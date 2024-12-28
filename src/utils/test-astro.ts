import { julian, solar, moonposition } from "astronomia";
import moment from "moment-timezone";

const normalizeLongitude = (longitude: number): number => {
  const degrees = (longitude * 180 / Math.PI) % 360;
  return degrees < 0 ? degrees + 360 : degrees;
};

const getZodiacSign = (longitude: number): string => {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  console.log(`Mapping longitude ${longitude}° to zodiac sign...`);
  const signIndex = Math.floor(longitude / 30);
  const sign = signs[signIndex];
  console.log(`Longitude ${longitude}° maps to ${sign} (index: ${signIndex})`);
  
  return sign;
};

const calculateJulianDay = (date: string, time: string, timeZone: string): number => {
  console.log("\n=== Julian Day Calculation ===");
  console.log("Input:", { date, time, timeZone });
  
  // Convert to UTC
  const utcMoment = moment.tz(`${date}T${time}:00`, timeZone).utc();
  const utcDate = utcMoment.format('YYYY-MM-DD');
  const utcTime = utcMoment.format('HH:mm');
  
  console.log("UTC DateTime:", { utcDate, utcTime });
  
  const [year, month, day] = utcDate.split('-').map(Number);
  const [hour, minute] = utcTime.split(':').map(Number);
  const fractionalDay = (hour + minute / 60) / 24;
  
  const jd = julian.CalendarGregorianToJD(year, month, day + fractionalDay);
  console.log("Calculated Julian Day:", jd);
  return jd;
};

const convertToTropicalLongitude = (siderealLongitude: number, jd: number): number => {
  // Apply precession correction
  const T = (jd - 2451545.0) / 36525.0;
  const precessionCorrection = 50.29 * T;
  const tropicalLong = (siderealLongitude - precessionCorrection + 360) % 360;
  
  console.log("Longitude Conversion:", {
    sidereal: siderealLongitude,
    precessionCorrection,
    tropical: tropicalLong
  });
  
  return tropicalLong;
};

const calculateSunPosition = (jd: number) => {
  console.log("\n=== Sun Position Calculation ===");
  console.log("Input Julian Day:", jd);
  
  const sunLongitude = solar.apparentLongitude(jd);
  console.log("Raw Sun Longitude (Radians):", sunLongitude);
  
  const tropicalLongitude = normalizeLongitude(sunLongitude);
  console.log("Tropical Sun Longitude (Degrees):", tropicalLongitude);
  
  const sunSign = getZodiacSign(tropicalLongitude);
  return { longitude: tropicalLongitude, sign: sunSign };
};

const calculateMoonPosition = (jd: number) => {
  console.log("\n=== Moon Position Calculation ===");
  console.log("Input Julian Day:", jd);
  
  const moonPos = moonposition.position(jd);
  console.log("Raw Moon Position:", moonPos);
  
  const tropicalLongitude = normalizeLongitude(moonPos.lon);
  console.log("Tropical Moon Longitude (Degrees):", tropicalLongitude);
  
  const moonSign = getZodiacSign(tropicalLongitude);
  return { longitude: tropicalLongitude, sign: moonSign };
};

const calculateAscendant = (jd: number, latitude: number, longitude: number) => {
  console.log("\n=== Ascendant Calculation ===");
  
  // Calculate GMST (Greenwich Mean Sidereal Time)
  const T = (jd - 2451545.0) / 36525;
  const gmst = (280.46061837 + 360.98564736629 * (jd - 2451545.0) +
                T * T * (0.000387933 - T / 38710000)) % 360;
  
  // Calculate Local Sidereal Time
  const lst = (gmst + longitude) % 360;
  
  // Calculate Ascendant
  const obliquity = 23.4367 * Math.PI / 180; // Mean obliquity for J2000.0
  const latRad = latitude * Math.PI / 180;
  
  const tanAsc = Math.cos(obliquity) * Math.sin(lst * Math.PI / 180) / 
                 (Math.cos(lst * Math.PI / 180) * Math.cos(latRad) - 
                  Math.sin(latRad) * Math.tan(obliquity));
  
  const ascendantRad = Math.atan(tanAsc);
  const ascendantDeg = normalizeLongitude(ascendantRad);
  const ascendantSign = getZodiacSign(ascendantDeg);
  
  console.log("Ascendant Longitude (Degrees):", ascendantDeg);
  return { longitude: ascendantDeg, sign: ascendantSign };
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

  const julianDay = calculateJulianDay(
    testCase.birthDate,
    testCase.birthTime,
    testCase.timeZone
  );
  
  const sun = calculateSunPosition(julianDay);
  const moon = calculateMoonPosition(julianDay);
  const ascendant = calculateAscendant(julianDay, testCase.latitude, testCase.longitude);

  console.log("\n=== Final Results ===");
  console.log("Sun:", { longitude: sun.longitude, sign: sun.sign });
  console.log("Moon:", { longitude: moon.longitude, sign: moon.sign });
  console.log("Ascendant:", { longitude: ascendant.longitude, sign: ascendant.sign });

  return {
    julianDay,
    signs: {
      sun: sun.sign,
      moon: moon.sign,
      rising: ascendant.sign
    }
  };
};