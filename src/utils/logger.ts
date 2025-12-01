import pino from "pino";

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || "info", // Default log level
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true, // Colorize log output
      translateTime: "SYS:HH:MM:ss Z", // Format timestamp
      ignore: "pid,hostname", // Ignore pid and hostname
    },
  },
});

// For production, remove pino-pretty transport
if (process.env.NODE_ENV === "production") {
  // @ts-ignore
  logger.transport = undefined; // Remove pino-pretty transport in production
}

export default logger;
