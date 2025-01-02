import { BirthChartData, BirthChartResult } from "@/utils/astro-utils";
import { calculateJulianDay, calculateDeltaT, calculateMeanSolarLongitude, calculateEquationOfTime, calculateLunarParallax, calculateGeocentricLatitude, calculateMoonLongitude } from '@/utils/astro-core';
import { dumpLogs } from "../utils/file-logger";
import { logAstroUtils } from "./utils-logging";

interface CalculationStep {
  functionName: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  timestamp: string;
}

interface CalculationLog {
  startTime: string;
  endTime: string;
  inputData: BirthChartData;
  steps: CalculationStep[];
  finalResult: BirthChartResult;
}

type AstroFunction = typeof calculateJulianDay | 
                     typeof calculateDeltaT | 
                     typeof calculateMeanSolarLongitude | 
                     typeof calculateEquationOfTime | 
                     typeof calculateLunarParallax | 
                     typeof calculateGeocentricLatitude | 
                     typeof calculateMoonLongitude;

export function logAllAstroCalculations(
  data: BirthChartData,
  calculationFunction: (data: BirthChartData) => BirthChartResult
): { result: BirthChartResult; log: CalculationLog } {
  const steps: CalculationStep[] = [];
  const log: CalculationLog = {
    startTime: new Date().toISOString(),
    inputData: data,
    steps,
    finalResult: null as unknown as BirthChartResult,
    endTime: "",
  };

  // Store original functions
  const originalFunctions = {
    calculateJulianDay,
    calculateDeltaT,
    calculateMeanSolarLongitude,
    calculateEquationOfTime,
    calculateLunarParallax,
    calculateGeocentricLatitude,
    calculateMoonLongitude,
  };

  // Create wrapped versions that log everything
  const wrappedFunctions = Object.entries(originalFunctions).reduce((acc, [name, fn]) => {
    acc[name] = function(this: any, ...args: Parameters<AstroFunction>) {
      const step: CalculationStep = {
        functionName: name,
        inputs: { args },
        outputs: {},
        timestamp: new Date().toISOString(),
      };

      try {
        const result = fn.apply(this, args);
        step.outputs = { result };
        steps.push(step);
        return result;
      } catch (error) {
        step.outputs = { error: error instanceof Error ? error.message : 'Unknown error' };
        steps.push(step);
        throw error;
      }
    };
    return acc;
  }, {} as typeof originalFunctions);

  // Replace the original functions with wrapped versions
  const tempWindow = window as any;
  Object.entries(wrappedFunctions).forEach(([key, value]) => {
    tempWindow[key] = value;
  });

  try {
    // Run calculation with wrapped functions
    const result = calculationFunction(data);
    log.finalResult = result;
    log.endTime = new Date().toISOString();

    logAstroUtils({
      event: 'CALCULATION_COMPLETE',
      data: log,
      timestamp: new Date().toISOString()
    });

    return { result, log };
  } finally {
    // Restore original functions and dump logs
    Object.entries(originalFunctions).forEach(([key, value]) => {
      tempWindow[key] = value;
    });
    dumpLogs();
  }
}