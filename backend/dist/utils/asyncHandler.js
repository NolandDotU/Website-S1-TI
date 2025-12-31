"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.asyncHandler = void 0;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
// Alternative using try-catch wrapper
const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.catchAsync = catchAsync;
//# sourceMappingURL=asyncHandler.js.map