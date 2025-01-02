export function logCoordinateCalculations(
  lat: number,
  lng: number,
  geoLat: number,
  lst: number
) {
  console.log("Coordinate Calculations:", {
    latitude: lat,
    longitude: lng,
    geocentricLatitude: geoLat,
    localSiderealTime: lst,
    timestamp: new Date().toISOString()
  });
}