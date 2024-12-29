import { julian, solar, moonposition, nutation, sidereal } from "astronomia";
import moment from "moment-timezone";

/** 
 * System type: "tropical" or "sidereal". 
 */
export type AstroSystem = "tropical" | "sidereal";

/** Data structure for birth chart input. */
export interface BirthChartData {
  name: string;
  birthDate: string;   // e.g., "1980-10-14"
  birthTime: string;   // e.g., "00:30"
  birthPlace: string;  // e.g., "Ipswich, UK"
  latitude: number;
  longitude: number;
}

/** Separate sign & degrees/minutes for each factor: Sun, Moon, Rising. */
export interface BirthChartResult {
  sunSign: string;
  sunDeg: number;
  sunMin: number;

  moonSign: string;
  moonDeg: number;
  moonMin: number;

  risingSign: string;
  risingDeg: number;
  risingMin: number;
}

/**
 * Main function:
 *  1) Convert birth time to JD(UT).
 *  2) Convert JD(UT) → JD(TT) via ΔT/86400.
 *  3) Calculate Sun & Moon (TT).
 *  4) Calculate Ascendant w/ nutation & obliquity (UT+TT).
 *  5) If sidereal, apply ayanāṃśa to Sun, Moon, Ascendant.
 *  6) Extract sign/deg/min for each.
 */
export function calculateBirthChart(
  data: BirthChartData,
  system: AstroSystem
): BirthChartResult {
  const { birthDate, birthTime, birthPlace, latitude, longitude } = data;

  // 1) Convert to JD(UT).
  const zone = moment.tz.zone(birthPlace) ? birthPlace : "UTC";
  const localTime = moment.tz(`${birthDate}T${birthTime}`, zone);
  const jdUT = toJulianDayUT(localTime);

  // 2) Approx. ΔT (sec), then get JD(TT).
  const deltaTsec = approximateDeltaT(localTime.year(), localTime.month() + 1);
  const jdTT = jdUT + deltaTsec / 86400;

  // 3) Sun & Moon in ecliptic longitude (TT).
  const sunLonTrop = solar.apparentLongitude(jdTT);
  const moonLonTrop = moonposition.position(jdTT).lon;

  // 4) Tropical Ascendant (using nutation/obliquity).
  const ascLonTrop = calcAscendant(jdUT, jdTT, latitude, longitude);

  // 5) Sidereal offset if Vedic.
  const offsetDeg = system === "sidereal" ? approximateAyanamsa(localTime.year()) : 0;
  const sunLon = wrap360(sunLonTrop - offsetDeg);
  const moonLon = wrap360(moonLonTrop - offsetDeg);
  const ascLon = wrap360(ascLonTrop - offsetDeg);

  // 6) Convert final longitudes → sign/deg/min
  const sunObj = extractSignDegrees(sunLon);
  const moonObj = extractSignDegrees(moonLon);
  const ascObj = extractSignDegrees(ascLon);

  return {
    sunSign: sunObj.sign,
    sunDeg: sunObj.deg,
    sunMin: sunObj.min,

    moonSign: moonObj.sign,
    moonDeg: moonObj.deg,
    moonMin: moonObj.min,

    risingSign: ascObj.sign,
    risingDeg: ascObj.deg,
    risingMin: ascObj.min,
  };
}

/** Convert local date/time → JD(UT). We add ΔT separately. */
function toJulianDayUT(m: moment.Moment) {
  const utc = m.clone().utc();
  const year = Number(utc.format("YYYY"));
  const month = Number(utc.format("MM"));
  const day = Number(utc.format("DD"));
  const hour = Number(utc.format("HH"));
  const minute = Number(utc.format("mm"));
  const fractionOfDay = (hour + minute / 60) / 24;
  return julian.CalendarGregorianToJD(year, month, day + fractionOfDay);
}

/** 
 * Rough ΔT approximation for modern (1900–2100) births. 
 * Real code might reference NASA data or more advanced polynomials.
 */
function approximateDeltaT(year: number, month: number) {
  const yMid = 2020;
  const base = 69.4; // sec in 2020
  const slope = 0.2; // sec/yr

  const yearsOffset = (year + (month - 0.5) / 12) - yMid;
  return base + slope * yearsOffset; 
}

/** 
 * Minimal Lahiri offset ~24° around 2020, shifting ~1° every 72 years.
 * Adjust as needed for real Vedic calc.
 */
function approximateAyanamsa(year: number) {
  const baseYear = 2020;
  const baseAyanamsa = 24; 
  const yearsDiff = year - baseYear;
  const shiftDeg = yearsDiff / 72;
  return baseAyanamsa - shiftDeg;
}

/** Wrap degrees into 0..360. */
function wrap360(deg: number) {
  return ((deg % 360) + 360) % 360;
}

/** 
 * Break ecliptic longitude into sign, deg, min. 
 */
function extractSignDegrees(longitude: number) {
  const normalized = wrap360(longitude);
  const signIndex = Math.floor(normalized / 30);

  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces",
  ];
  const sign = signs[signIndex];

  const degreesIntoSign = normalized - signIndex * 30;
  const degWhole = Math.floor(degreesIntoSign);
  let minWhole = Math.round((degreesIntoSign - degWhole) * 60);

  let finalDeg = degWhole;
  if (minWhole === 60) {
    finalDeg += 1;
    minWhole = 0;
  }

  return { sign, deg: finalDeg, min: minWhole };
}

/** 
 * TDT + nutation approach → tropical Asc. 
 * We'll apply ayanamsa separately for sidereal. 
 */
function calcAscendant(jdUT: number, jdTT: number, lat: number, lon: number) {
  const { dpsi, deps } = nutation.nutation(jdTT); // Fixed: using nutation directly
  const eps0 = nutation.meanObliquity(jdTT);  // Fixed: using nutation for meanObliquity
  const eps = eps0 + deps;  // true obliquity

  // GAST in hours
  const gastH = sidereal.apparent(jdUT, dpsi, eps);
  const gastDeg = wrap360(gastH * 15);

  let lstDeg = gastDeg + lon;
  lstDeg = wrap360(lstDeg);

  const lstRad = (lstDeg * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const ascRad = Math.atan2(-Math.cos(lstRad), Math.tan(latRad));
  return wrap360((ascRad * 180) / Math.PI);
}