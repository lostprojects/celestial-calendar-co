import { julian, solar, moonposition } from "astronomia";

export const calculateJulianDay = (utcDate: string, utcTime: string): number => {
  const [year, month, day] = utcDate.split("-").map(Number);
  const [hour, minute] = utcTime.split(":").map(Number);
  return julian.CalendarGregorianToJD(year, month, day + hour / 24 + minute / 1440);
};

export const calculateSiderealTime = (julianDay: number, longitude: number): number => {
  const T = (julianDay - 2451545.0) / 36525.0;
  const GMST = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 
               T * T * (0.000387933 - T / 38710000.0);
  return (GMST + longitude) % 360;
};

export const calculateAscendant = (siderealTime: number, latitude: number): number => {
  const radians = (degrees: number) => degrees * (Math.PI / 180);
  const degrees = (radians: number) => radians * (180 / Math.PI);
  const obliquity = radians(23.439281);
  const latRad = radians(latitude);
  const lstRad = radians(siderealTime);

  return (degrees(Math.atan2(
    -Math.cos(lstRad),
    Math.sin(lstRad) * Math.cos(obliquity) - Math.tan(latRad) * Math.sin(obliquity)
  )) + 360) % 360;
};

export const getZodiacSign = (longitude: number): string => {
  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  return zodiacSigns[Math.floor((longitude % 360) / 30)];
};

export const calculateSunSign = (julianDay: number): string => {
  return getZodiacSign(solar.apparentLongitude(julianDay));
};

export const calculateMoonSign = (julianDay: number): string => {
  return getZodiacSign(moonposition.position(julianDay).lon);
};

export const calculateRisingSign = (julianDay: number, latitude: number, longitude: number): string => {
  const siderealTime = calculateSiderealTime(julianDay, longitude);
  return getZodiacSign(calculateAscendant(siderealTime, latitude));
};