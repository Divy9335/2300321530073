const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logsDir, 'app.log');

function ensureLogDirectory() {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

function writeLog(entry) {
  ensureLogDirectory();
  const payload = typeof entry === 'string' ? entry : JSON.stringify(entry);
  fs.appendFileSync(logFile, `${payload}\n`, 'utf8');
}

function formatLog(level, message, meta) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta && { meta })
  };
}

const logger = {
  info(message, meta) {
    writeLog(formatLog('info', message, meta));
  },
  warn(message, meta) {
    writeLog(formatLog('warn', message, meta));
  },
  error(message, meta) {
    writeLog(formatLog('error', message, meta));
  },
  debug(message, meta) {
    writeLog(formatLog('debug', message, meta));
  }
};

module.exports = logger;
