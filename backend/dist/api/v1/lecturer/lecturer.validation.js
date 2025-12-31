"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryLecturerSchema = exports.LecturerValidation = void 0;
const zod_1 = require("zod");
exports.LecturerValidation = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(4, "Username must be at least 4 characters long")
        .max(100, "Username must be at most 100 characters long"),
    fullname: zod_1.z
        .string()
        .min(4, "Fullname must be at least 4 characters long")
        .max(100, "Fullname must be at most 100 characters long"),
    email: zod_1.z.string().email("Please enter a valid email").toLowerCase(),
    expertise: zod_1.z.array(zod_1.z.string()),
    externalLink: zod_1.z.string().optional(),
    photo: zod_1.z.string().optional(),
});
exports.queryLecturerSchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).default(1).optional(),
    limit: zod_1.z.string().transform(Number).default(10).optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(["name", "createdAt"]).optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
});
//# sourceMappingURL=lecturer.validation.js.map