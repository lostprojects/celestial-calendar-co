export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogConfig {
  level: LogLevel;
  enabled: boolean;
}