export function logSunPosition(longitudeRad: number, longitudeDeg: number, normalizedDeg: number) {
  console.log("Sun Position Calculations:", {
    longitudeRadians: longitudeRad,
    longitudeDegrees: longitudeDeg,
    normalizedDegrees: normalizedDeg,
    timestamp: new Date().toISOString()
  });
}

export function logMoonCalculations(
  distance: number,
  parallax: number,
  geoLat: number,
  lst: number,
  hourAngle: number,
  deltaRA: number,
  deltaDec: number,
  topoPos: { _ra: number; _dec: number }
) {
  console.log("Moon Calculations:", {
    distance,
    parallax,
    geocentricLatitude: geoLat,
    localSiderealTime: lst,
    hourAngle,
    deltaRightAscension: deltaRA,
    deltaDeclination: deltaDec,
    topocentricPosition: topoPos,
    timestamp: new Date().toISOString()
  });
}