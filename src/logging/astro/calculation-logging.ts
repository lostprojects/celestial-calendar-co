import { BirthChartData, BirthChartResult } from "@/utils/astro-utils";
import { calculateJulianDay, calculateDeltaT, calculateMeanSolarLongitude, calculateEquationOfTime, calculateLunarParallax, calculateGeocentricLatitude, calculateMoonLongitude } from "@/utils/astro-core";
import { dumpLogs } from "../utils/file-logger";
import { logAstroUtils } from "./utils-logging";

interface CalculationStep {
  functionName: string;
  inputs: Record<string, any>;
  intermediateSteps: Record<string, any>;
  outputs: Record<string, any>;
  timestamp: string;
  childSteps?: CalculationStep[];
}

interface CalculationLog {
  startTime: string;
  endTime: string;
  inputData: BirthChartData;
  steps: CalculationStep[];
  finalResult: BirthChartResult;
}

export function logAllAstroCalculations(
  data: BirthChartData,
  calculationFunction: (data: BirthChartData) => BirthChartResult
): { result: BirthChartResult; log: CalculationLog } {
  const log: CalculationLog = {
    startTime: new Date().toISOString(),
    inputData: data,
    steps: [],
    finalResult: null as unknown as BirthChartResult,
    endTime: "",
  };

  // Wrap core calculation functions to capture everything
  const wrappedJulianDay = (utcDate: string, utcTime: string) => {
    const step: CalculationStep = {
      functionName: "calculateJulianDay",
      inputs: { utcDate, utcTime },
      intermediateSteps: {},
      outputs: {},
      timestamp: new Date().toISOString(),
    };

    const [year, month, day] = utcDate.split('-').map(Number);
    const [hour, minute] = utcTime.split(':').map(Number);
    
    step.intermediateSteps = {
      year, month, day, hour, minute,
    };
    
    const result = calculateJulianDay(utcDate, utcTime);
    step.outputs = { julianDay: result };
    log.steps.push(step);
    return result;
  };

  const wrappedDeltaT = (jd: number) => {
    const step: CalculationStep = {
      functionName: "calculateDeltaT",
      inputs: { julianDay: jd },
      intermediateSteps: {},
      outputs: {},
      timestamp: new Date().toISOString(),
    };

    const T = (jd - 2451545.0) / 36525;
    step.intermediateSteps = { julianCenturies: T };
    
    const result = calculateDeltaT(jd);
    step.outputs = { deltaT: result };
    log.steps.push(step);
    return result;
  };

  const wrappedMeanSolarLongitude = (jde: number) => {
    const step: CalculationStep = {
      functionName: "calculateMeanSolarLongitude",
      inputs: { julianEphemerisDay: jde },
      intermediateSteps: {},
      outputs: {},
      timestamp: new Date().toISOString(),
    };

    const T = (jde - 2451545.0) / 36525;
    step.intermediateSteps = { julianCenturies: T };
    
    const result = calculateMeanSolarLongitude(jde);
    step.outputs = { meanLongitude: result };
    log.steps.push(step);
    return result;
  };

  const wrappedEquationOfTime = (jde: number) => {
    const step: CalculationStep = {
      functionName: "calculateEquationOfTime",
      inputs: { julianEphemerisDay: jde },
      intermediateSteps: {},
      outputs: {},
      timestamp: new Date().toISOString(),
    };

    const result = calculateEquationOfTime(jde);
    step.outputs = { equationOfTime: result };
    log.steps.push(step);
    return result;
  };

  const wrappedLunarParallax = (moonDistance: number) => {
    const step: CalculationStep = {
      functionName: "calculateLunarParallax",
      inputs: { moonDistance },
      intermediateSteps: {},
      outputs: {},
      timestamp: new Date().toISOString(),
    };

    const result = calculateLunarParallax(moonDistance);
    step.outputs = { parallax: result };
    log.steps.push(step);
    return result;
  };

  const wrappedGeocentricLatitude = (geographicLat: number) => {
    const step: CalculationStep = {
      functionName: "calculateGeocentricLatitude",
      inputs: { geographicLatitude: geographicLat },
      intermediateSteps: {},
      outputs: {},
      timestamp: new Date().toISOString(),
    };

    const result = calculateGeocentricLatitude(geographicLat);
    step.outputs = { geocentricLatitude: result };
    log.steps.push(step);
    return result;
  };

  const wrappedMoonLongitude = (moonPos: { _ra: number; _dec: number }, epsRad: number) => {
    const step: CalculationStep = {
      functionName: "calculateMoonLongitude",
      inputs: { 
        rightAscension: moonPos._ra, 
        declination: moonPos._dec, 
        obliquityRadians: epsRad 
      },
      intermediateSteps: {},
      outputs: {},
      timestamp: new Date().toISOString(),
    };

    const result = calculateMoonLongitude(moonPos, epsRad);
    step.outputs = { moonLongitude: result };
    log.steps.push(step);
    return result;
  };

  // Override global logging function to capture everything
  const originalLogAstroUtils = logAstroUtils;
  (global as any).logAstroUtils = (logData: any) => {
    log.steps.push({
      functionName: logData.event,
      inputs: logData.inputs || {},
      intermediateSteps: logData.intermediateSteps || {},
      outputs: logData.outputs || {},
      timestamp: logData.timestamp,
    });
    originalLogAstroUtils(logData);
  };

  try {
    // Run the actual calculation with our wrapped functions
    const result = calculationFunction(data);
    log.finalResult = result;
    log.endTime = new Date().toISOString();

    // Dump all logs
    dumpLogs();

    return { result, log };
  } finally {
    // Restore original logging function
    (global as any).logAstroUtils = originalLogAstroUtils;
  }
}