import fs from 'fs';
import path from 'path';

const LOG_DIR = 'logs/astro';
const MAX_LOG_FILES = 10;

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

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

// Function to write logs to file
export function dumpLogs() {
  if (currentLogs.length === 0) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `astro-calc-${timestamp}.log`;
  const filepath = path.join(LOG_DIR, filename);

  // Write current logs to file
  fs.writeFileSync(filepath, currentLogs.join('\n'));
  currentLogs = []; // Clear current logs

  // Get all log files and keep only the last MAX_LOG_FILES
  const files = fs.readdirSync(LOG_DIR)
    .filter(file => file.endsWith('.log'))
    .sort()
    .reverse();

  // Remove older files
  if (files.length > MAX_LOG_FILES) {
    files.slice(MAX_LOG_FILES).forEach(file => {
      fs.unlinkSync(path.join(LOG_DIR, file));
    });
  }
}

// Dump logs on process exit
process.on('exit', dumpLogs);
