export interface ILogger {
  debug(message: string, ...meta: any[]): void
  info(message: string, ...meta: any[]): void
  warn(message: string, ...meta: any[]): void
  error(error: Error): void
  log(message: string, ...meta: any[]): void
}
