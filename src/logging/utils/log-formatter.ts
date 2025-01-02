export function formatDegrees(degrees: number): string {
  const wholeDegrees = Math.floor(degrees);
  const minutes = Math.floor((degrees - wholeDegrees) * 60);
  return `${wholeDegrees}° ${minutes}'`;
}

export function formatTime(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.floor((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
}

export function getTimestamp(): string {
  return new Date().toISOString();
}