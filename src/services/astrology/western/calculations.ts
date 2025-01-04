import moment from 'moment-timezone';
import * as solar from "astronomia/solar";
import * as sidereal from "astronomia/sidereal";
import * as nutation from "astronomia/nutation";
import * as deltat from "astronomia/deltat";
import { position as getMoonPosition } from "astronomia/moonposition";
import * as refraction from "astronomia/refraction";
import * as parallax from "astronomia/parallax";
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
  WesternChartResult, 
  AstronomicalConstants
} from '../types';

export class WesternCalculator {
  calculateBirthChart(data: BirthChartData): WesternChartResult {
    this.validateInput(data);
    
    const [year, month, day] = data.birthDate.split("-").map(Number);
    const [hour, minute] = data.birthTime.split(":").map(Number);
    
    logger.debug("Processing Western birth chart for", {
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
    
    const deltaT = deltat.deltaT(jd);
    const jde = jd + deltaT / 86400;
    
    const obliquity = calculateObliquity(jde);
    const [nutLong, nutObl] = nutation.nutation(jde);
    
    const constants: AstronomicalConstants = {
      obliquity: obliquity + nutObl,
      nutationLong: nutLong,
      nutationObl: nutObl,
      jde,
      deltaT
    };
    
    // Calculate apparent solar position
    const sunLongRad = solar.apparentLongitude(jde);
    const sunLongDeg = rad2deg(sunLongRad);
    const sunLong = normalizeDegrees(sunLongDeg);
    
    // Calculate lunar position with parallax correction
    const moonPos = getMoonPosition(jde);
    const parallaxCorr = parallax.horizontal(moonPos.range, data.latitude);
    
    const topoMoonPos = {
      _ra: moonPos._ra,
      _dec: moonPos._dec - deg2rad(parallaxCorr),
      range: moonPos.range
    };
    
    const moonLongRad = calculateMoonLongitude(topoMoonPos, constants.obliquity);
    const moonLong = normalizeDegrees(rad2deg(moonLongRad));
    
    // Calculate sidereal time and local sidereal time
    const gst = sidereal.apparent(jde);
    const lst = (gst + data.longitude/15) % 24;
    const lstDeg = lst * 15;
    
    // Apply refraction correction
    const altitudeCorrection = refraction.bennett2(deg2rad(lstDeg));
    const correctedLstDeg = lstDeg + rad2deg(altitudeCorrection);

    const sunPosition = this.getZodiacPosition(sunLong);
    const moonPosition = this.getZodiacPosition(moonLong);
    const ascPosition = this.getZodiacPosition(correctedLstDeg);

    const result: WesternChartResult = {
      system: 'western',
      sunSign: sunPosition.sign,
      moonSign: moonPosition.sign,
      risingSign: ascPosition.sign,
      sunDeg: sunPosition.degrees,
      sunMin: sunPosition.minutes,
      moonDeg: moonPosition.degrees,
      moonMin: moonPosition.minutes,
      risingDeg: ascPosition.degrees,
      risingMin: ascPosition.minutes,
      absolutePositions: {
        sun: sunPosition.absoluteDegrees,
        moon: moonPosition.absoluteDegrees,
        ascending: ascPosition.absoluteDegrees
      },
      calculation: {
        jde,
        deltaT,
        obliquity: constants.obliquity,
        nutationLong: constants.nutationLong,
        nutationObl: constants.nutationObl
      }
    };

    logger.debug("Final Western calculation result", result);
    return result;
  }

  private getZodiacPosition(longitude: number) {
    const normalized = normalizeDegrees(longitude);
    logger.debug("Calculating zodiac position", {
      rawLongitude: longitude,
      normalized
    });
    
    const signIndex = Math.floor(normalized / 30);
    const totalDegrees = normalized % 30;
    const degrees = Math.floor(totalDegrees);
    const minutes = Math.floor((totalDegrees - degrees) * 60);
    
    return {
      sign: ZODIAC_SIGNS[signIndex],
      degrees,
      minutes,
      absoluteDegrees: normalized
    };
  }

  private validateInput(data: BirthChartData): void {
    const currentYear = new Date().getFullYear();
    const [year] = data.birthDate.split("-").map(Number);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
      throw new Error('Birth date must be in YYYY-MM-DD format');
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.birthTime)) {
      throw new Error('Birth time must be in HH:mm format (24-hour)');
    }
    if (data.latitude < -90 || data.latitude > 90) {
      throw new Error('Latitude must be between -90 and 90 degrees');
    }
    if (data.longitude < -180 || data.longitude > 180) {
      throw new Error('Longitude must be between -180 and 180 degrees');
    }
    if (year < 1800 || year > currentYear) {
      throw new Error('Birth year must be between 1800 and present');
    }

    // Validate polar regions
    const ARCTIC_CIRCLE = 66.5;
    if (Math.abs(data.latitude) > ARCTIC_CIRCLE) {
      logger.warn('Calculating birth chart for polar region', {
        latitude: data.latitude,
        date: data.birthDate
      });
    }
  }

  private determineTimezone(latitude: number, longitude: number, providedTimezone?: string): string {
    if (providedTimezone && moment.tz.zone(providedTimezone)) {
      return providedTimezone;
    }
    return 'UTC';
  }
}

export const westernCalculator = new WesternCalculator();
