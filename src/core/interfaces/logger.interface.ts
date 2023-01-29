export interface ILogger {
  /**
   * Log (Level = debug)
   * @param message Debug message
   * @param args arguments to print
   */
  debug(message: string, ...args: any[]): void;
  /**
   * Log (Level = info)
   * @param message info message
   * @param args arguments to print
   */
  info(message: string, ...args: any[]): void;
  /**
   * Log (Level = warn)
   * @param message Warn message
   * @param args arguments to print
   */
  warn(message: string, ...args: any[]): void;
  /**
   * Log (Level = error)
   * @param message Error message
   * @param args arguments to print
   */
  error(message: string, ...args: any[]): void;

  /**
   * Sets the request Id to print with the logs
   * @param requestId Unique request identifier
   */
  setRequestId?(requestId: string): void;
  /**
   * Sets the scope of the logger (filename)
   * @param scope adds the __filename to the message
   */
  setScope?(scope: string): void;
}
