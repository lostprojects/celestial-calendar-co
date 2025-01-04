import moment from 'moment-timezone';
import { logger } from "../../../lib/logger";
import {
  calculateJulianDay,
  calculateMoonLongitude,
  calculateObliquity,
  ZODIAC_SIGNS,
  deg2rad,
  rad2deg,
  normalizeDegrees
} from '../core';

import type { 
  BirthChartData, 
  VedicChartResult, 
  AstronomicalConstants
} from '../types';

const AYANAMSA_2000 = 23.85; // Lahiri ayanamsa at J2000.0
const AYANAMSA_ANNUAL_PRECESSION = 50.27777778 / 3600; // Annual precession rate in degrees

type Nakshatra = typeof NAKSHATRAS[number];
type DashaLord = keyof typeof DASHA_PERIODS;

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
] as const;

const DASHA_PERIODS = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
} as const;

export class VedicCalculator {
  calculateBirthChart(data: BirthChartData): VedicChartResult {
    this.validateInput(data);
    
    const [year, month, day] = data.birthDate.split("-").map(Number);
    const [hour, minute] = data.birthTime.split(":").map(Number);
    
    logger.debug("Processing Vedic birth chart for", {
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`,
      place: data.birthPlace,
      lat: data.latitude,
      lng: data.longitude
    });
    
    const timezone = this.determineTimezone(data.latitude, data.longitude, data.timezone);
    const localMoment = moment.tz([year, month - 1, day, hour, minute], timezone);
    const utcMoment = localMoment.utc();
    
    const jd = calculateJulianDay(
      utcMoment.format("YYYY-MM-DD"),
      utcMoment.format("HH:mm")
    );
    
    // Calculate ayanamsa (precession correction)
    const yearsFrom2000 = (jd - 2451545.0) / 365.25;
    const ayanamsa = AYANAMSA_2000 + (AYANAMSA_ANNUAL_PRECESSION * yearsFrom2000);
    
    // Get tropical positions first (same as Western)
    const westernPositions = this.calculateTropicalPositions(data, jd);
    
    // Convert to sidereal by applying ayanamsa
    const siderealPositions = {
      sun: normalizeDegrees(westernPositions.sun - ayanamsa),
      moon: normalizeDegrees(westernPositions.moon - ayanamsa),
      ascending: normalizeDegrees(westernPositions.ascending - ayanamsa)
    };
    
    // Calculate nakshatra and pada for Moon
    const moonNakshatra = this.calculateNakshatra(siderealPositions.moon);
    
    // Calculate current dasha
    const dasha = this.calculateDasha(moonNakshatra.nakshatra, jd);
    
    const result: VedicChartResult = {
      system: 'vedic',
      sunSign: this.getZodiacSign(siderealPositions.sun),
      moonSign: this.getZodiacSign(siderealPositions.moon),
      risingSign: this.getZodiacSign(siderealPositions.ascending),
      sunDeg: Math.floor(siderealPositions.sun % 30),
      sunMin: Math.floor((siderealPositions.sun % 1) * 60),
      moonDeg: Math.floor(siderealPositions.moon % 30),
      moonMin: Math.floor((siderealPositions.moon % 1) * 60),
      risingDeg: Math.floor(siderealPositions.ascending % 30),
      risingMin: Math.floor((siderealPositions.ascending % 1) * 60),
      absolutePositions: siderealPositions,
      calculation: westernPositions.calculation,
      nakshatra: {
        moon: moonNakshatra.nakshatra,
        pada: moonNakshatra.pada
      },
      dashas: {
        current: dasha.current,
        remaining: dasha.remaining
      }
    };

    logger.debug("Final Vedic calculation result", result);
    return result;
  }

  private calculateTropicalPositions(data: BirthChartData, jd: number) {
    // This reuses the core astronomical calculations
    // but without applying the sidereal correction
    // Implementation would mirror Western calculations
    // but is omitted for brevity
    return {
      sun: 0, // Calculate actual position
      moon: 0, // Calculate actual position
      ascending: 0, // Calculate actual position
      calculation: {
        jde: jd,
        deltaT: 0, // Calculate actual value
        obliquity: 23.4, // Calculate actual value
        nutationLong: 0, // Calculate actual value
        nutationObl: 0 // Calculate actual value
      }
    };
  }

  private calculateNakshatra(moonLongitude: number) {
    const nakshatra_deg = 360 / 27; // Each nakshatra is 13°20'
    const pada_deg = nakshatra_deg / 4; // Each pada is 3°20'
    
    const nakshatraIndex = Math.floor(moonLongitude / nakshatra_deg);
    const pada = Math.floor((moonLongitude % nakshatra_deg) / pada_deg) + 1;
    
    return {
      nakshatra: NAKSHATRAS[nakshatraIndex],
      pada
    };
  }

  private calculateDasha(nakshatra: Nakshatra, jd: number) {
    // Simplified dasha calculation
    // In a real implementation, this would use the
    // precise birth time and nakshatra position
    const nakshatraIndex = NAKSHATRAS.indexOf(nakshatra);
    const dashaLord = Object.keys(DASHA_PERIODS)[nakshatraIndex % 9] as DashaLord;
    const periodYears = DASHA_PERIODS[dashaLord];
    
    return {
      current: dashaLord,
      remaining: periodYears // This would normally calculate actual remaining years
    };
  }

  private getZodiacSign(longitude: number): typeof ZODIAC_SIGNS[number] {
    const signIndex = Math.floor(longitude / 30);
    return ZODIAC_SIGNS[signIndex];
  }

  private validateInput(data: BirthChartData): void {
    // Reuse Western validation
    const currentYear = new Date().getFullYear();
    const [year] = data.birthDate.split("-").map(Number);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
      throw new Error('Birth date must be in YYYY-MM-DD format');
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.birthTime)) {
      throw new Error('Birth time must be in HH:mm format (24-hour)');
    }
    if (year < 1800 || year > currentYear) {
      throw new Error('Birth year must be between 1800 and present');
    }
  }

  private determineTimezone(latitude: number, longitude: number, providedTimezone?: string): string {
    if (providedTimezone && moment.tz.zone(providedTimezone)) {
      return providedTimezone;
    }
    return 'UTC';
  }
}

export const vedicCalculator = new VedicCalculator();
