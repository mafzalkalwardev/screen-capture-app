const fs = require('fs');
const path = require('path');

/**
 * Logger utility for application logging
 */
class Logger {
  constructor(logDir = './logs') {
    this.logDir = logDir;
    this.ensureLogDirectory();
    this.logFile = path.join(this.logDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Format log message with timestamp
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {object} data - Additional data
   * @returns {string} Formatted log message
   */
  formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const dataStr = Object.keys(data).length > 0 ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  /**
   * Write log to file
   * @param {string} message - Message to log
   */
  writeToFile(message) {
    try {
      fs.appendFileSync(this.logFile, message + '\n');
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  /**
   * Log info level message
   */
  info(message, data) {
    const formatted = this.formatMessage('INFO', message, data);
    console.log(formatted);
    this.writeToFile(formatted);
  }

  /**
   * Log warning level message
   */
  warn(message, data) {
    const formatted = this.formatMessage('WARN', message, data);
    console.warn(formatted);
    this.writeToFile(formatted);
  }

  /**
   * Log error level message
   */
  error(message, error, data) {
    const errorData = {
      ...data,
      errorMessage: error?.message,
      errorStack: error?.stack
    };
    const formatted = this.formatMessage('ERROR', message, errorData);
    console.error(formatted);
    this.writeToFile(formatted);
  }

  /**
   * Log debug level message
   */
  debug(message, data) {
    if (process.env.DEBUG === 'true') {
      const formatted = this.formatMessage('DEBUG', message, data);
      console.log(formatted);
      this.writeToFile(formatted);
    }
  }

  /**
   * Clear old log files
   * @param {number} daysToKeep - Number of days of logs to keep
   */
  clearOldLogs(daysToKeep = 7) {
    try {
      const files = fs.readdirSync(this.logDir);
      const now = new Date();

      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        const daysDiff = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

        if (daysDiff > daysToKeep) {
          fs.unlinkSync(filePath);
          console.log(`Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      console.error('Failed to clear old logs:', error);
    }
  }
}

module.exports = new Logger();