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
}

export interface CelestialPosition {
  _ra: number;
  _dec: number;
  range?: number;
}

export interface AstronomicalConstants {
  obliquity: number;
  nutationLong: number;
  nutationObl: number;
}