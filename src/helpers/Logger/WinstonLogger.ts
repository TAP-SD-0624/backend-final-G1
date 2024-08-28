import winston from 'winston'
import { ILogger } from './ILogger'
export class WinstonLogger implements ILogger {
  logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        level: 'error',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: 'logs.log',
        level: 'info',
      }),
    ],
  })

  debug(message: string, ...meta: any[]): void {
    throw new Error('Method not implemented.')
  }
  info(message: string, ...meta: any[]): void {
    throw new Error('Method not implemented.')
  }
  warn(message: string, ...meta: any[]): void {
    throw new Error('Method not implemented.')
  }
  error(error: Error): void {
    this.logger.error({
      name: error.name,
      message: error.message,
      stack: error?.stack,
    })
  }
  log(level: string, message: string, ...meta: any[]): void {
    throw new Error('Method not implemented.')
  }
}
