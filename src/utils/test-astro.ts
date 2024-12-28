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
  
  // Convert to decimal day (noon = 0.5)
  const decimalTime = (hour + minute / 60) / 24;
  
  return julian.CalendarGregorianToJD(year, month, day) + decimalTime - 0.5;
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

  console.log("Case 1: Jan 1, 2024");
  console.log(JSON.stringify(results.case1, null, 2));
  
  console.log("\nCase 2: Jan 1, 1990");
  console.log(JSON.stringify(results.case2, null, 2));

  return results;
};