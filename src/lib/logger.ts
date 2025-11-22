/**
 * Simple structured logging system for production
 * Logs are written to console and can be captured by PM2/system logs
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      };
    }

    const formattedLog = this.formatLog(entry);

    // In production, log to console (will be captured by PM2)
    // In development, use colored console output
    if (this.isDevelopment) {
      const colors = {
        info: '\x1b[36m',    // Cyan
        warn: '\x1b[33m',    // Yellow
        error: '\x1b[31m',   // Red
        debug: '\x1b[35m',   // Magenta
      };
      const reset = '\x1b[0m';
      console.log(`${colors[level]}[${level.toUpperCase()}]${reset} ${message}`, context || '');
      if (error) {
        console.error(error);
      }
    } else {
      // Production: structured JSON logs
      console.log(formattedLog);
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('error', message, context, error);
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience functions for common use cases
export const logAuthAttempt = (email: string, success: boolean, ip?: string) => {
  logger.info('Authentication attempt', {
    email,
    success,
    ip,
    timestamp: Date.now(),
  });
};

export const logApiRequest = (method: string, path: string, userId?: string, ip?: string) => {
  logger.info('API request', {
    method,
    path,
    userId,
    ip,
    timestamp: Date.now(),
  });
};

export const logError = (error: Error, context?: Record<string, unknown>) => {
  logger.error('Application error', error, context);
};

export const logRateLimitExceeded = (identifier: string, endpoint: string) => {
  logger.warn('Rate limit exceeded', {
    identifier,
    endpoint,
    timestamp: Date.now(),
  });
};
