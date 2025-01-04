declare module "astronomia/julian" {
  export function CalendarGregorianToJD(year: number, month: number, day: number): number;
}

declare module "astronomia/solar" {
  export function apparentLongitude(jd: number): number;
}

declare module "astronomia/moonposition" {
  export function position(jd: number): {
    _ra: number;    // Right ascension in radians
    _dec: number;   // Declination in radians
    range: number;  // Distance in km
  };
}

declare module "astronomia/sidereal" {
  export function mean(jd: number): number;
  export function apparent(jd: number): number;
}

declare module "astronomia/nutation" {
  export function nutation(jd: number): [number, number]; // Returns [longitude, obliquity] in radians
}

declare module "astronomia/deltat" {
  export function deltaT(jd: number): number;
}

declare module "astronomia/refraction" {
  export function bennett2(altitude: number): number;
}

declare module "astronomia/parallax" {
  export function horizontal(distance: number, latitude: number): number;
}
