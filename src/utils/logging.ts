import { createClientBrowser } from './supabase/client'

/**
 * Log levels to categorize log messages
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

/**
 * Interface for log entry structure
 */
interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, any>
  timestamp: string
  service: string
}

/**
 * Environment-aware logging utility
 * In development, logs to console
 * In production, could log to a database or external service
 */
export class Logger {
  private service: string
  private enableConsole: boolean = true
  private enableDatabase: boolean = false
  
  constructor(service: string) {
    this.service = service
    
    // In production, enable database logging
    if (process.env.NODE_ENV === 'production') {
      this.enableDatabase = true
    }
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARNING, message, context)
  }

  /**
   * Log an error message
   */
  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context)
  }

  /**
   * Log a critical error message
   */
  critical(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.CRITICAL, message, context)
  }

  /**
   * Main logging function
   */
  private async log(level: LogLevel, message: string, context?: Record<string, any>): Promise<void> {
    const timestamp = new Date().toISOString()
    
    const logEntry: LogEntry = {
      level,
      message,
      context: context ? this.sanitizeContext(context) : undefined,
      timestamp,
      service: this.service
    }
    
    // Always log to console in development
    if (this.enableConsole) {
      this.logToConsole(logEntry)
    }
    
    // Log to database in production
    if (this.enableDatabase) {
      await this.logToDatabase(logEntry)
    }
  }

  /**
   * Format and log to console with color coding
   */
  private logToConsole(logEntry: LogEntry): void {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARNING]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.CRITICAL]: '\x1b[35m' // Magenta
    }
    
    const reset = '\x1b[0m'
    const levelColor = colors[logEntry.level] || reset
    
    const formattedMessage = `${levelColor}[${logEntry.timestamp}] [${logEntry.level}] [${logEntry.service}]${reset}: ${logEntry.message}`
    
    switch (logEntry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, logEntry.context || '')
        break
      case LogLevel.INFO:
        console.info(formattedMessage, logEntry.context || '')
        break
      case LogLevel.WARNING:
        console.warn(formattedMessage, logEntry.context || '')
        break
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(formattedMessage, logEntry.context || '')
        break
      default:
        console.log(formattedMessage, logEntry.context || '')
    }
  }

  /**
   * Log to a database for persistence
   */
  private async logToDatabase(logEntry: LogEntry): Promise<void> {
    try {
      const supabase = createClientBrowser()
      
      await supabase.from('system_logs').insert({
        level: logEntry.level,
        message: logEntry.message,
        context: logEntry.context,
        service: logEntry.service,
        created_at: logEntry.timestamp
      })
    } catch (error) {
      // If database logging fails, fall back to console
      console.error('Failed to log to database:', error)
      this.enableConsole = true
      this.logToConsole({
        ...logEntry,
        message: `Failed to log to database: ${logEntry.message}`
      })
    }
  }

  /**
   * Sanitize sensitive data in context object
   */
  private sanitizeContext(context: Record<string, any>): Record<string, any> {
    const sanitized = { ...context }
    
    // List of keys that might contain sensitive information
    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'credential', 'authorization',
      'apiKey', 'api_key', 'privateKey', 'private_key'
    ]
    
    // Sanitize nested objects
    const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
      const result: Record<string, any> = {}
      
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase()
        
        // Check if this is a sensitive key
        const isSensitive = sensitiveKeys.some(sensitiveKey => 
          lowerKey.includes(sensitiveKey.toLowerCase())
        )
        
        if (isSensitive && typeof value === 'string') {
          result[key] = '[REDACTED]'
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          result[key] = sanitizeObject(value)
        } else {
          result[key] = value
        }
      }
      
      return result
    }
    
    return sanitizeObject(sanitized)
  }
}

// Create singleton instances for common services
export const apiLogger = new Logger('api')
export const nlpLogger = new Logger('nlp')
export const openaiLogger = new Logger('openai')
export const systemLogger = new Logger('system') 