"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
const errorMiddleware = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof ApiError_1.ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Ini logging error
    logger_1.logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });
    // ini payload response
    const response = {
        success: false,
        message,
    };
    // Kalo di development ada stack errornya di file mana
    if (env_1.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }
    res.status(statusCode).json(response);
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map