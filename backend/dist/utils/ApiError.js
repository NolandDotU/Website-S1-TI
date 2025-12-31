"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, errors, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = isOperational;
        this.errors = errors;
        this.stack = stack;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        if (stack) {
            //error nya ada di file mana + line berapa
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    // Static factory methods
    static badRequest(message, errors) {
        return new ApiError(400, message, true, errors);
    }
    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }
    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }
    static notFound(message = "Resource not found") {
        return new ApiError(404, message);
    }
    static conflict(message) {
        return new ApiError(409, message);
    }
    static internal(message = "Internal server error") {
        return new ApiError(500, message, false);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map