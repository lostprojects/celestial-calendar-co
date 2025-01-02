export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogConfig {
  level: LogLevel;
  enabled: boolean;
}

export const logConfig: LogConfig = {
  level: 'DEBUG',
  enabled: true
};

export function shouldLog(level: LogLevel): boolean {
  const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
  return logConfig.enabled && levels.indexOf(level) >= levels.indexOf(logConfig.level);
}

export function formatLogObject(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

export function getTimestamp(): string {
  return new Date().toISOString();
}