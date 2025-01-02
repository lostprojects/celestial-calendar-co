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
  const wrappedFunctions = {
    calculateJulianDay: (utcDate: string, utcTime: string) => {
      const step: CalculationStep = {
        functionName: "calculateJulianDay",
        inputs: { utcDate, utcTime },
        intermediateSteps: {},
        outputs: {},
        timestamp: new Date().toISOString(),
      };

      try {
        const result = originalFunctions.calculateJulianDay(utcDate, utcTime);
        step.outputs = { julianDay: result };
        steps.push(step);
        return result;
      } catch (error) {
        step.outputs = { error: error.message };
        steps.push(step);
        throw error;
      }
    },

    calculateDeltaT: (jd: number) => {
      const step: CalculationStep = {
        functionName: "calculateDeltaT",
        inputs: { julianDay: jd },
        intermediateSteps: {},
        outputs: {},
        timestamp: new Date().toISOString(),
      };

      try {
        const result = originalFunctions.calculateDeltaT(jd);
        step.outputs = { deltaT: result };
        steps.push(step);
        return result;
      } catch (error) {
        step.outputs = { error: error.message };
        steps.push(step);
        throw error;
      }
    },

    calculateMeanSolarLongitude: (jde: number) => {
      const step: CalculationStep = {
        functionName: "calculateMeanSolarLongitude",
        inputs: { julianEphemerisDay: jde },
        intermediateSteps: {},
        outputs: {},
        timestamp: new Date().toISOString(),
      };

      try {
        const result = originalFunctions.calculateMeanSolarLongitude(jde);
        step.outputs = { meanLongitude: result };
        steps.push(step);
        return result;
      } catch (error) {
        step.outputs = { error: error.message };
        steps.push(step);
        throw error;
      }
    },

    calculateEquationOfTime: (jde: number) => {
      const step: CalculationStep = {
        functionName: "calculateEquationOfTime",
        inputs: { julianEphemerisDay: jde },
        intermediateSteps: {},
        outputs: {},
        timestamp: new Date().toISOString(),
      };

      try {
        const result = originalFunctions.calculateEquationOfTime(jde);
        step.outputs = { equationOfTime: result };
        steps.push(step);
        return result;
      } catch (error) {
        step.outputs = { error: error.message };
        steps.push(step);
        throw error;
      }
    },

    calculateLunarParallax: (moonDistance: number) => {
      const step: CalculationStep = {
        functionName: "calculateLunarParallax",
        inputs: { moonDistance },
        intermediateSteps: {},
        outputs: {},
        timestamp: new Date().toISOString(),
      };

      try {
        const result = originalFunctions.calculateLunarParallax(moonDistance);
        step.outputs = { parallax: result };
        steps.push(step);
        return result;
      } catch (error) {
        step.outputs = { error: error.message };
        steps.push(step);
        throw error;
      }
    },

    calculateGeocentricLatitude: (geographicLat: number) => {
      const step: CalculationStep = {
        functionName: "calculateGeocentricLatitude",
        inputs: { geographicLatitude: geographicLat },
        intermediateSteps: {},
        outputs: {},
        timestamp: new Date().toISOString(),
      };

      try {
        const result = originalFunctions.calculateGeocentricLatitude(geographicLat);
        step.outputs = { geocentricLatitude: result };
        steps.push(step);
        return result;
      } catch (error) {
        step.outputs = { error: error.message };
        steps.push(step);
        throw error;
      }
    },

    calculateMoonLongitude: (moonPos: { _ra: number; _dec: number }, epsRad: number) => {
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

      try {
        const result = originalFunctions.calculateMoonLongitude(moonPos, epsRad);
        step.outputs = { moonLongitude: result };
        steps.push(step);
        return result;
      } catch (error) {
        step.outputs = { error: error.message };
        steps.push(step);
        throw error;
      }
    },
  };

  // Replace the original functions with wrapped versions
  Object.assign(window, wrappedFunctions);

  try {
    // Run calculation with wrapped functions
    const result = calculationFunction(data);
    log.finalResult = result;
    log.endTime = new Date().toISOString();
    return { result, log };
  } finally {
    // Restore original functions
    Object.assign(window, originalFunctions);
  }
}