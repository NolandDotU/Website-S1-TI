import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import morgan from "morgan";
import { env, isDev } from "../config/env";
import { meta } from "zod/v4/core";
import { log } from "console";

//Costum log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Condolse format untuk fase development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }), //bikin timestap jadi JAM:MENIT:DETIK
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} ${level}: ${message}`;
    if (Object.keys(meta).length > 0) {
      //ini kalo ada metadata bakalan masuk ke message juga
      msg += JSON.stringify(meta);
    }
    return msg; //contoh output : 12:33:21 info: Server started
  })
);

//Ini baru bagian bikin logger
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: isDev ? consoleFormat : logFormat,
    }),

    new DailyRotateFile({
      filename: "logs/%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: logFormat,
    }),

    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      level: "error",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: logFormat,
    }),
  ],
});

//Ini buat middleware logger, jadi tau endpoint mana yang di akses
//contoh : GET /auth/login 200 234 - 18.4 ms
export const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);
