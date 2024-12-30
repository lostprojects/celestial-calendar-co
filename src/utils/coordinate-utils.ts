import { nutation, sidereal } from "astronomia";

export function calculateSiderealTime(jdUT: number, jdTT: number): {
  gastH: number;
  dpsi: number;
  deps: number;
  epsTrue: number;
} {
  // Get nutation parameters
  const nutVals = nutation.nutation(jdTT);
  const dpsi = nutVals.dpsi;
  const deps = nutVals.deps;
  
  const meanEps = nutation.meanObliquity(jdTT);
  const epsTrue = meanEps + deps;
  
  console.log("[DEBUG] Nutation values:", {
    dpsi,
    deps,
    meanEps,
    epsTrue
  });
  
  // Calculate apparent sidereal time
  const gastH = sidereal.apparent(jdUT, dpsi, epsTrue);
  
  console.log("[DEBUG] Sidereal time:", {
    gastH,
    gastDeg: gastH * 15
  });
  
  return { gastH, dpsi, deps, epsTrue };
}

export function calculateAscendant(
  gastH: number,
  latitude: number,
  longitude: number,
  epsTrue: number
): number {
  // Convert to radians
  const lstDeg = wrap360(gastH * 15 + longitude);
  const lstRad = lstDeg * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const epsTrueRad = epsTrue;
  
  console.log("[DEBUG] Ascendant inputs:", {
    gastH,
    latitude,
    longitude,
    lstDeg,
    lstRad,
    latRad,
    epsTrueRad
  });
  
  // Calculate ascendant
  const cosLst = Math.cos(lstRad);
  const sinLst = Math.sin(lstRad);
  const cosEps = Math.cos(epsTrueRad);
  const sinEps = Math.sin(epsTrueRad);
  const tanLat = Math.tan(latRad);
  
  console.log("[DEBUG] Ascendant trig values:", {
    cosLst,
    sinLst,
    cosEps,
    sinEps,
    tanLat
  });
  
  const numerator = cosLst;
  const denominator = -sinLst * cosEps + tanLat * sinEps;
  
  const ascRad = Math.atan2(numerator, denominator);
  const ascDeg = wrap360(ascRad * 180 / Math.PI);
  
  console.log("[DEBUG] Ascendant result:", {
    numerator,
    denominator,
    ascRad,
    ascDeg
  });
  
  return ascDeg;
}

export function wrap360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}