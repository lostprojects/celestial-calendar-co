import { LogLevel } from '../utils/types';

export interface AstroEvent {
  event: string;
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  intermediateSteps?: Record<string, any>;
  timestamp: string;
  level?: LogLevel;
}

export function logAstroUtils(event: AstroEvent) {
  console.log(JSON.stringify({
    ...event,
    level: event.level || 'DEBUG',
    timestamp: event.timestamp || new Date().toISOString()
  }, null, 2));
}