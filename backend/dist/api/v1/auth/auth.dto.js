"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRegisterSchema = exports.AdminLoginSchema = void 0;
const zod_1 = require("zod");
// Admin login
exports.AdminLoginSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username minimal 3 karakter"),
    password: zod_1.z.string().min(6, "Password minimal 6 karakter"),
});
exports.AdminRegisterSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username minimal 3 karakter"),
    email: zod_1.z.string().email("Email tidak valid").optional(),
    password: zod_1.z.string().min(6, "Password minimal 6 karakter"),
});
//# sourceMappingURL=auth.dto.js.map