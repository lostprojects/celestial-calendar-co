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
  
  // Log inputs for validation
  console.log("Julian Day Inputs:", {
    year,
    month,
    day,
    hour,
    minute,
    fractionalDay: hour / 24 + minute / 1440
  });

  // Calculate using both methods
  const astronomiaJD = julian.CalendarGregorianToJD(year, month, day + hour / 24 + minute / 1440);
  const manualJD = calculateManualJulianDay(year, month, day, hour, minute);

  console.log("Julian Day Comparison:", {
    astronomia: astronomiaJD,
    manual: manualJD
  });

  // Use manual calculation as it matches expected results
  return manualJD;
};

const runTestCase = (testCase: TestCase) => {
  const utcConversion = convertToUT(
    testCase.birthDate,
    testCase.birthTime,
    testCase.timeZone
  );
  
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

  console.log("\nCase 1: Jan 1, 2024");
  console.log(JSON.stringify(results.case1, null, 2));
  
  console.log("\nCase 2: Jan 1, 1990");
  console.log(JSON.stringify(results.case2, null, 2));

  return results;
};