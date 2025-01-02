export interface TimeLogData {
  date: string;
  time: string;
  timezone: string;
  offset: string;
  isDST: boolean;
}

export interface PositionLogData {
  longitude: number;
  latitude: number;
  altitude?: number;
  azimuth?: number;
}

export interface ZodiacLogData {
  sign: string;
  degrees: number;
  minutes: number;
  totalDegrees: number;
}