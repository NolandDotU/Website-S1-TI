"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("../config/env");
//Costum log format
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
// Condolse format untuk fase development
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "HH:mm:ss" }), //bikin timestap jadi JAM:MENIT:DETIK
winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} ${level}: ${message}`;
    if (Object.keys(meta).length > 0) {
        //ini kalo ada metadata bakalan masuk ke message juga
        msg += JSON.stringify(meta);
    }
    return msg; //contoh output : 12:33:21 info: Server started
}));
//Ini baru bagian bikin logger
exports.logger = winston_1.default.createLogger({
    level: env_1.env.LOG_LEVEL,
    format: logFormat,
    transports: [
        new winston_1.default.transports.Console({
            format: env_1.isDev ? consoleFormat : logFormat,
        }),
        new winston_daily_rotate_file_1.default({
            filename: "logs/%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            format: logFormat,
        }),
        new winston_daily_rotate_file_1.default({
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
exports.morganMiddleware = (0, morgan_1.default)(":method :url :status :res[content-length] - :response-time ms", {
    stream: {
        write: (message) => exports.logger.http(message.trim()),
    },
});
//# sourceMappingURL=logger.js.map