export const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
] as const;

// Convert degrees to radians
export function deg2rad(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Convert radians to degrees
export function rad2deg(radians: number): number {
  return radians * 180 / Math.PI;
}

// Normalize degrees to 0-360 range
export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

// Calculate Julian Day from UTC date and time
export function calculateJulianDay(date: string, time: string): number {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4);
  jd = jd - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add time fraction
  jd += (hour - 12) / 24 + minute / 1440;
  
  return jd;
}

// Calculate obliquity of the ecliptic
export function calculateObliquity(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  const U = T / 100;
  
  let eps = 23.43929111;
  eps += (-4680.93 * U - 1.55 * U ** 2 + 1999.25 * U ** 3 
          - 51.38 * U ** 4 - 249.67 * U ** 5 
          - 39.05 * U ** 6 + 7.12 * U ** 7 
          + 27.87 * U ** 8 + 5.79 * U ** 9 
          + 2.45 * U ** 10) / 3600;
          
  return eps;
}

// Calculate Moon's ecliptic longitude
export function calculateMoonLongitude(
  moonPos: { _ra: number; _dec: number; range: number }, 
  obliquity: number
): number {
  const ra = moonPos._ra;
  const dec = moonPos._dec;
  
  // Convert equatorial coordinates to ecliptic
  const sinEps = Math.sin(deg2rad(obliquity));
  const cosEps = Math.cos(deg2rad(obliquity));
  
  const sinDec = Math.sin(dec);
  const cosDec = Math.cos(dec);
  const sinRa = Math.sin(ra);
  const cosRa = Math.cos(ra);
  
  const tanLat = (sinDec * cosEps - cosDec * sinEps * sinRa) / (cosDec * cosRa);
  const sinLong = (sinDec * sinEps + cosDec * cosEps * sinRa) / Math.sin(Math.acos(cosDec * cosRa));
  
  let longitude = rad2deg(Math.atan(tanLat));
  
  // Adjust quadrant
  if (cosRa < 0) {
    longitude += 180;
  } else if (sinLong < 0) {
    longitude += 360;
  }
  
  return longitude;
}
