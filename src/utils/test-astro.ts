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

const calculateJulianDay = (date: string, time: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const fractionalDay = hour / 24 + minute / 1440;
  
  console.log("Julian Day Calculation:", {
    inputs: { year, month, day, hour, minute },
    fractionalDay: fractionalDay.toFixed(6)
  });

  return julian.CalendarGregorianToJD(year, month, day + fractionalDay);
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
  
  // Validate against known correct value for 2024-01-01 17:00 UTC
  if (testCase.birthDate === '2024-01-01' && utcConversion.utcTime === '17:00') {
    const expectedJD = 2460311.208333;
    const difference = Math.abs(julianDay - expectedJD);
    console.log("Validation Check:", {
      calculated: julianDay,
      expected: expectedJD,
      difference,
      isValid: difference < 0.000001
    });
  }
  
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