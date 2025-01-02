const MAX_LOGS = 10;
const LOG_KEY = 'astro_calculation_logs';

interface LogEntry {
  timestamp: string;
  logs: string;
}

// Get existing logs from localStorage
const getStoredLogs = (): LogEntry[] => {
  const storedLogs = localStorage.getItem(LOG_KEY);
  return storedLogs ? JSON.parse(storedLogs) : [];
};

// Store logs in localStorage
const storeLogs = (logs: LogEntry[]) => {
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
};

// Capture console output
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error
};

let currentLogs: string[] = [];

// Override console methods to capture output
console.log = (...args) => {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
  currentLogs.push(`[LOG] ${message}`);
  originalConsole.log(...args);
};

console.warn = (...args) => {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
  currentLogs.push(`[WARN] ${message}`);
  originalConsole.warn(...args);
};

console.error = (...args) => {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
  currentLogs.push(`[ERROR] ${message}`);
  originalConsole.error(...args);
};

// Function to save logs
export function dumpLogs() {
  if (currentLogs.length === 0) return;

  const timestamp = new Date().toISOString();
  const logEntry: LogEntry = {
    timestamp,
    logs: currentLogs.join('\n')
  };

  const storedLogs = getStoredLogs();
  storedLogs.unshift(logEntry);
  
  // Keep only the last MAX_LOGS entries
  while (storedLogs.length > MAX_LOGS) {
    storedLogs.pop();
  }

  storeLogs(storedLogs);
  currentLogs = []; // Clear current logs
}

// Export function to read logs
export function getLogs() {
  return getStoredLogs();
}

// Dump logs on window unload
window.addEventListener('unload', dumpLogs);