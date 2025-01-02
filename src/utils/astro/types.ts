export interface CelestialPosition {
  _ra: number;  // Right ascension in radians
  _dec: number; // Declination in radians
  range?: number;
}

export interface BirthChartData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  utc_offset?: number;
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
  absolutePositions?: {
    sun: number;
    moon: number;
    ascending: number;
  };
  calculation?: {
    jde: number;
    deltaT: number;
    obliquity: number;
    nutationLong: number;
    nutationObl: number;
  };
}

export interface AstronomicalConstants {
  obliquity: number;
  nutationLong: number;
  nutationObl: number;
  jde?: number;
  deltaT?: number;
}