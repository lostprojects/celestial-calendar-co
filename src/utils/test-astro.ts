import { julian } from "astronomia";
import moment from "moment-timezone";

// Test Julian Day calculation
const julianDay = julian.CalendarGregorianToJD(2024, 1, 1);
console.log("Julian Day Test:", julianDay);

// Test Moment Timezone conversion
const timeZoneTest = moment.tz("2024-01-01T12:00:00", "America/New_York").utc().format();
console.log("Moment Timezone Test:", timeZoneTest);

// Export the test functions for potential future use
export const runTests = () => {
  return {
    julianDay,
    timeZoneTest
  };
};