"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const utils_1 = require("../utils");
const jwt_1 = require("../utils/jwt");
const authMiddleware = (roles) => (0, utils_1.asyncHandler)(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.cookies?.refreshToken || null;
    utils_1.logger.info("Access Token in auth middleware : ", accessToken);
    if (!accessToken) {
        throw ApiError_1.ApiError.unauthorized("Access token required");
    }
    try {
        const user = (0, jwt_1.verifyToken)(accessToken);
        if (roles && !roles.includes(user.role)) {
            throw ApiError_1.ApiError.forbidden(`Access denied. Required roles: ${roles.join(", ")}`);
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError && error.message === "Token expired") {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                throw ApiError_1.ApiError.unauthorized("Session expired. Please login again");
            }
            try {
                const refreshPayload = (0, jwt_1.verifyToken)(refreshToken, true);
                const newPayload = {
                    id: refreshPayload.id,
                    email: refreshPayload.email,
                    role: refreshPayload.role,
                    authProvider: refreshPayload.authProvider,
                    username: refreshPayload.username,
                };
                const newAccessToken = (0, jwt_1.generateToken)(newPayload);
                const newRefreshToken = (0, jwt_1.generateRefreshToken)(newPayload);
                const user = (0, jwt_1.verifyToken)(newAccessToken);
                if (roles && !roles.includes(user.role)) {
                    throw ApiError_1.ApiError.forbidden(`Access denied. Required roles: ${roles.join(", ")}`);
                }
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000,
                });
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                req.user = user;
                next();
            }
            catch (refreshError) {
                res.redirect("/no-access");
                throw ApiError_1.ApiError.unauthorized("Invalid refresh token. Please login again");
            }
        }
        else {
            throw error;
        }
    }
});
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map