export interface BirthChartData {
  birthDate: string;    // YYYY-MM-DD format
  birthTime: string;    // HH:mm format
  birthPlace: string;   // Location name
  latitude: number;     // Geographic latitude in degrees
  longitude: number;    // Geographic longitude in degrees
  timezone?: string;    // IANA timezone identifier (optional)
}

export interface BirthChartResult {
  sunSign: string;      // Zodiac sign name
  moonSign: string;     // Zodiac sign name
  risingSign: string;   // Zodiac sign name
  sunDeg: number;       // Degrees within sign (0-29)
  sunMin: number;       // Minutes within degree (0-59)
  moonDeg: number;      // Degrees within sign (0-29)
  moonMin: number;      // Minutes within degree (0-59)
  risingDeg: number;    // Degrees within sign (0-29)
  risingMin: number;    // Minutes within degree (0-59)
  absolutePositions: {  // Absolute positions in degrees (0-359)
    sun: number;
    moon: number;
    ascending: number;
  };
  calculation: {        // Technical calculation details
    jde: number;        // Julian Ephemeris Day
    deltaT: number;     // Delta T (time correction)
    obliquity: number;  // True obliquity of ecliptic
    nutationLong: number; // Nutation in longitude
    nutationObl: number;  // Nutation in obliquity
  };
}

export interface CelestialPosition {
  _ra: number;    // Right ascension in radians
  _dec: number;   // Declination in radians
  range: number;  // Distance in km
}

export interface AstronomicalConstants {
  obliquity: number;    // True obliquity of ecliptic
  nutationLong: number; // Nutation in longitude
  nutationObl: number;  // Nutation in obliquity
  jde: number;         // Julian Ephemeris Day
  deltaT: number;      // Delta T (time correction)
}
