import winston from "winston";
// import { LoggingWinston } from "@google-cloud/logging-winston";

const { combine, timestamp, json } = winston.format;
// const loggingWinston = new LoggingWinston();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: "logs.log",
    }),
    // loggingWinston,
  ],
});

export default logger;
