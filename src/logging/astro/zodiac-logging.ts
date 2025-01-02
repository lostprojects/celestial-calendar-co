export function logZodiacPosition(
  longitude: number,
  signIndex: number,
  sign: string,
  degrees: number,
  minutes: number
) {
  console.log("Zodiac Position Calculation:", {
    totalLongitude: longitude,
    signIndex,
    zodiacSign: sign,
    degreesInSign: degrees,
    arcMinutes: minutes,
    timestamp: new Date().toISOString()
  });
}

export function logFinalPositions(
  sun: { sign: string; degrees: number; minutes: number },
  moon: { sign: string; degrees: number; minutes: number },
  ascendant: { sign: string; degrees: number; minutes: number }
) {
  console.log("Final Zodiac Positions:", {
    sun,
    moon,
    ascendant,
    timestamp: new Date().toISOString()
  });
}