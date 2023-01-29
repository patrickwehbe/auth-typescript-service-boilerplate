import { format, transports } from "winston";
import * as winston from "winston";

/**
 * Configures default winston logger
 */
export const configLogger = (isDevEnv: boolean, logLevel: string) => {
  const { splat, combine, timestamp, printf, colorize, simple } = format;

  //Used to colorize output based log level
  const colorizer = colorize();

  const getMessage = (level, message, timestamp, metadata) => {
    //General format
    let msg = `${timestamp} [${level}] : ${message} `;
    //Formatting additional metadata (e.g. error stack)
    if (Object.keys(metadata).length != 0 && metadata.constructor === Object) {
      // If object is an error display data as string
      if (level === "error") {
        Object.keys(metadata).map((x) => {
          msg += `\n${metadata[x]}`;
        });
      } else {
        // Else stringify json
        msg += `\n${JSON.stringify(metadata, null, 4)}`;
      }
    }
    return msg;
  };

  //Formatting the message for dev
  const msgDevFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = getMessage(level, message, timestamp, metadata);
    return colorizer.colorize(level, msg);
  });

  //Formatting the message for prod
  const msgProdFormat = printf(({ level, message, timestamp, ...metadata }) => {
    return getMessage(level, message, timestamp, metadata);
  });

  //Configure default colors
  winston.addColors({
    error: "red",
    warn: "yellow",
    info: "cyan",
    debug: "green"
  });

  //Dev format
  const devFormat = combine(
    splat(),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    msgDevFormat
  );

  //Production format
  const prodFormat = combine(
    splat(),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    msgProdFormat
  );

  // Create logger
  const logger = winston.createLogger({
    transports: [
      new transports.Console({
        level: logLevel,
        handleExceptions: true,
        format: isDevEnv ? devFormat : prodFormat
      })
    ]
  });

  //Attach logger to default logger
  winston.add(logger);
};
