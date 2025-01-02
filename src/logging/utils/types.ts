export interface LogEntry {
  event: string;
  data: any;
  timestamp: string;
}

export interface CalculationLog {
  inputs: Record<string, any>;
  intermediateSteps?: Record<string, any>;
  outputs: Record<string, any>;
  timestamp: string;
}