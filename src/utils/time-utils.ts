import { julian } from "astronomia";

export function calculateJulianDays(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): { jdUT: number; jdTT: number } {
  console.log("[DEBUG] Time inputs:", { year, month, day, hour, minute });
  
  const fractionOfDay = (hour + minute / 60) / 24;
  console.log("[DEBUG] Day fraction:", fractionOfDay);
  
  const jdUT = julian.CalendarGregorianToJD(year, month, day + fractionOfDay);
  
  // Calculate Delta T and get TT
  const deltaTsec = approximateDeltaT(year, month);
  const jdTT = jdUT + deltaTsec / 86400;
  
  console.log("[DEBUG] Julian Days:", {
    jdUT,
    deltaTsec,
    jdTT,
    difference: jdTT - jdUT
  });
  
  return { jdUT, jdTT };
}

export function approximateDeltaT(year: number, month: number): number {
  // Values from https://eclipse.gsfc.nasa.gov/SEcat5/deltat.html
  const y = year + (month - 0.5) / 12;
  
  let deltaT;
  if (y >= 1975 && y < 2000) {
    deltaT = 45.45 + 1.067 * (y - 1975);
  } else if (y >= 1950 && y < 1975) {
    const t = y - 1950;
    deltaT = 29.07 + 0.407 * t + t * t * (25.3/100);
  } else {
    // Default approximation for other years
    const yMid = 2020;
    const base = 69.4;
    const slope = 0.2;
    const yearsOffset = y - yMid;
    deltaT = base + slope * yearsOffset;
  }
  
  console.log("[DEBUG] Delta T calculation:", {
    year,
    month,
    y,
    deltaT,
    formula: "Using NASA polynomial approximation"
  });
  
  return deltaT;
}