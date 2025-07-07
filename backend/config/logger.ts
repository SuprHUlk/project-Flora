import winston from "winston";
// import { LoggingWinston } from "@google-cloud/logging-winston";
import { Console } from "winston/lib/winston/transports";

const { combine, timestamp, printf, colorize, errors } = winston.format;
// const loggingWinston = new LoggingWinston();

// Custom format for console output with colors and better formatting
const consoleFormat = combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level}]: ${stack || message}`;
    })
);

// File format without colors but with structured JSON
const fileFormat = combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    winston.format.json()
);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    transports: [
        new winston.transports.File({
            filename: "logs.log",
            format: fileFormat,
        }),
        new Console({
            format: consoleFormat,
        }),
        // loggingWinston,
    ],
});

export default logger;
