import { julian, nutation, sidereal } from "astronomia";

export interface BirthChartData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
}

export interface BirthChartResult {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  sunDeg: number;
  sunMin: number;
  moonDeg: number;
  moonMin: number;
  risingDeg: number;
  risingMin: number;
}

function validateNumericValue(value: number | undefined, description: string) {
  if (value === undefined || isNaN(value)) {
    throw new Error(`Invalid ${description}: ${value}`);
  }
}

export function calculateBirthChart(data: BirthChartData, system: "tropical" | "sidereal"): BirthChartResult {
  console.log("[DEBUG] Starting birth chart calculation for:", {
    birthDate: data.birthDate,
    birthTime: data.birthTime,
    birthPlace: data.birthPlace,
    latitude: data.latitude,
    longitude: data.longitude,
    system
  });

  // Parse birth date and time
  const [year, month, day] = data.birthDate.split("-").map(Number);
  const [hour, minute] = data.birthTime.split(":").map(Number);
  
  // Calculate fraction of day
  const fractionOfDay = (hour + minute / 60) / 24;
  
  console.log("[DEBUG] Julian Day inputs:", {
    year, month, day, hour, minute, fractionOfDay
  });

  // Calculate Julian Day
  const jd = julian.DateToJD(year, month, day + fractionOfDay);
  
  // Calculate Julian Ephemeris Day (JDE)
  const deltaT = 36.392465; // ΔT value for 1980 (example)
  const jde = jd + deltaT / 86400;

  console.log("[DEBUG] Time conversion:", {
    deltaTsec: deltaT,
    jd,
    jde,
    difference: jde - jd
  });

  // Calculate nutation
  const T = (jde - 2451545.0) / 36525; // Julian centuries since J2000.0
  const { Δψ, Δε } = nutation.nutation(T);
  const ε0 = nutation.meanObliquity(T); // mean obliquity
  const ε = ε0 + Δε; // true obliquity

  validateNumericValue(Δψ, "Nutation dpsi (radians)");
  validateNumericValue(Δε, "Nutation deps (radians)");
  validateNumericValue(ε, "Obliquity (radians)");

  // For testing, return placeholder values
  return {
    sunSign: "Libra",
    moonSign: "Taurus",
    risingSign: "Cancer",
    sunDeg: 15,
    sunMin: 30,
    moonDeg: 25,
    moonMin: 45,
    risingDeg: 5,
    risingMin: 15
  };
}