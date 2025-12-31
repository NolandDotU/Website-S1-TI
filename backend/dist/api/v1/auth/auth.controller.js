"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth.service"));
const passport_1 = __importDefault(require("passport"));
const ApiError_1 = require("../../../utils/ApiError");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const utils_1 = require("../../../utils");
const env_1 = require("../../../config/env");
class AuthController {
    constructor() {
        this.service = auth_service_1.default;
        this.setCookies = (res, accessToken, refreshToken) => {
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        };
        this.checkMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const token = req.cookies["accessToken"] || null;
            if (!token) {
                throw ApiError_1.ApiError.unauthorized("User not authenticated");
            }
            const user = (0, utils_1.verifyToken)(token);
            console.log("user : ", typeof user);
            if (!user) {
                throw ApiError_1.ApiError.unauthorized("User not authenticated");
            }
            const currentUser = await this.service.checkMe(user.id);
            console.log("currentUser : ", currentUser);
            return res.send(utils_1.ApiResponse.success(currentUser, "User retrieved successfully", 200));
        });
        this.adminLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const user = await this.service.adminLogin(req.body);
            utils_1.logger.info("Admin logged in:", user);
            this.setCookies(res, user.accessToken, user.refreshToken);
            utils_1.logger.info("Cookies set for admin login : ", res.cookie);
            return res.send(utils_1.ApiResponse.success(null, "Admin logged in successfully", 200));
        });
        this.createAdmin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            if (process.env.NODE_ENV !== "development")
                throw ApiError_1.ApiError.forbidden();
            const currentUser = req.user;
            utils_1.logger.info("Current User creating admin:", currentUser);
            const user = await this.service.createAdmin(req.body, currentUser?.id);
            return utils_1.ApiResponse.success(null, "Admin created successfully", 201);
        });
        this.googleAuth = passport_1.default.authenticate("google", {
            scope: ["email", "profile"],
            prompt: "select_account",
        });
        this.googleAuthCallback = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            if (!req.user) {
                return res.redirect(`${env_1.env.FRONTEND_ORIGIN}/login?error=google_auth_failed`);
            }
            const result = await auth_service_1.default.handleGoogleAuth(req.user);
            this.setCookies(res, result.accessToken, result.refreshToken);
            const payloadUser = {
                username: result.user.username,
                photo: result.user.photo,
                email: result.user.email,
            };
            res.cookie("user", JSON.stringify(payloadUser), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });
            res.redirect(`${env_1.env.FRONTEND_ORIGIN}/`);
        });
        this.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.clearCookie("user");
            return res.send(utils_1.ApiResponse.success(null, "Logout berhasil", 200));
        });
    }
}
const authController = new AuthController();
exports.default = authController;
//# sourceMappingURL=auth.controller.js.map