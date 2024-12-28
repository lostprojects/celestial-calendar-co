import { julian } from "astronomia";
import moment from "moment-timezone";

interface TestCase {
  birthDate: string;
  birthTime: string;
  timeZone: string;
}

const convertToUT = (date: string, time: string, timeZone: string) => {
  const localDateTime = `${date}T${time}:00`;
  const utcMoment = moment.tz(localDateTime, timeZone).utc();
  
  return {
    utcDate: utcMoment.format('YYYY-MM-DD'),
    utcTime: utcMoment.format('HH:mm')
  };
};

// Temporary manual calculation for validation
const calculateManualJulianDay = (year: number, month: number, day: number, hour: number, minute: number) => {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const fractionalDay = hour / 24 + minute / 1440;
  
  return Math.floor(365.25 * (year + 4716)) +
         Math.floor(30.6001 * (month + 1)) +
         day + fractionalDay + B - 1524.5;
};

const calculateJulianDay = (date: string, time: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const fractionalDay = hour / 24 + minute / 1440;
  
  // Log inputs for validation
  console.log("Astronomia Inputs:", {
    year,
    month,
    day,
    hour,
    minute,
    fractionalDay
  });

  // Calculate using both methods for validation
  const astronomiaJD = julian.CalendarGregorianToJD(
    year,
    month,
    day + fractionalDay // Pass the fractional day component correctly
  );
  
  const manualJD = calculateManualJulianDay(year, month, day, hour, minute);

  // Log detailed comparison
  console.log("Julian Day Calculation Details:", {
    inputs: {
      dateString: date,
      timeString: time,
      yearMonthDay: `${year}-${month}-${day}`,
      fractionalDay: fractionalDay.toFixed(6)
    },
    results: {
      astronomia: astronomiaJD,
      manual: manualJD,
      difference: Math.abs(astronomiaJD - manualJD)
    }
  });

  // Use Astronomia's calculation as it's now properly handling fractional days
  return astronomiaJD;
};

const runTestCase = (testCase: TestCase) => {
  console.log("\nRunning Test Case:", testCase);
  
  const utcConversion = convertToUT(
    testCase.birthDate,
    testCase.birthTime,
    testCase.timeZone
  );
  
  console.log("UTC Conversion:", utcConversion);
  
  const julianDay = calculateJulianDay(
    utcConversion.utcDate,
    utcConversion.utcTime
  );
  
  return {
    input: testCase,
    utcConversion,
    julianDay
  };
};

export const runTests = () => {
  console.log("\n=== Starting Julian Day Calculation Tests ===\n");
  
  const case1: TestCase = {
    birthDate: "2024-01-01",
    birthTime: "12:00",
    timeZone: "America/New_York"
  };

  const case2: TestCase = {
    birthDate: "1990-01-01",
    birthTime: "12:00",
    timeZone: "America/New_York"
  };

  const results = {
    case1: runTestCase(case1),
    case2: runTestCase(case2)
  };

  console.log("\nTest Results Summary:");
  console.log("Case 1 (2024-01-01):", results.case1.julianDay);
  console.log("Case 2 (1990-01-01):", results.case2.julianDay);
  
  console.log("\n=== Julian Day Calculation Tests Complete ===\n");

  return results;
};