import { BirthChartData } from "@/utils/astro-utils";
import moment from "moment-timezone";

export function logTimeInputs(data: BirthChartData) {
  console.log("Time Input Data:", {
    date: data.birthDate,
    time: data.birthTime,
    place: data.birthPlace,
    coordinates: {
      lat: data.latitude,
      lng: data.longitude
    }
  });
}

export function logTimezoneDetection(timezone: string, coordinates: {lat: number, lng: number}) {
  console.log("Timezone Detection:", {
    detectedZone: timezone,
    fromCoordinates: coordinates,
    method: "Geographic boundary detection",
    timestamp: new Date().toISOString()
  });
}

export function logTimeConversion(local: moment.Moment, utc: moment.Moment) {
  console.log("Time Conversion Details:", {
    localDateTime: local.format("YYYY-MM-DD HH:mm:ss Z"),
    utcDateTime: utc.format("YYYY-MM-DD HH:mm:ss [UTC]"),
    offset: local.format("Z"),
    isDST: local.isDST(),
    timezoneAbbr: local.zoneAbbr(),
    timestamp: new Date().toISOString()
  });
}

export function logJulianCalculations(jd: number, deltaT: number, jde: number, eot: number) {
  console.log("Julian Date Calculations:", {
    julianDay: jd,
    deltaT,
    julianEphemerisDay: jde,
    equationOfTime: eot,
    timestamp: new Date().toISOString()
  });
}