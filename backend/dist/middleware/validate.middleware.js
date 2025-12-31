"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            throw ApiError_1.ApiError.badRequest(err.issues.map((e) => e.message).join(", "));
        }
        next(err);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map