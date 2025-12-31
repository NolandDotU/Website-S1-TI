"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(success, statusCode, message, data, meta) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }
    static success(data, message = "Success", statusCode = 200, meta) {
        return new ApiResponse(true, statusCode, message, data, meta);
    }
    static error(message, statusCode = 500, errors) {
        return {
            success: false,
            statusCode,
            message,
            errors,
        };
    }
    static paginated(data, page, limit, total, message = "Data fetched successfully") {
        return new ApiResponse(true, 200, message, {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        });
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map