import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils";
import {
  verifyToken,
  generateToken,
  generateRefreshToken,
  DecodedJWT,
  JWTPayload,
} from "../utils/jwt";

export const authMiddleware = (roles: string[] | null) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw ApiError.unauthorized("Access token required");
    }

    try {
      const user = verifyToken(accessToken);
      if (roles && !roles.includes(user.role)) {
        throw ApiError.forbidden(
          `Access denied. Required roles: ${roles.join(", ")}`
        );
      }
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof ApiError && error.message === "Token expired") {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
          throw ApiError.unauthorized("Session expired. Please login again");
        }

        try {
          const refreshPayload = verifyToken(refreshToken, true);

          const newPayload: JWTPayload = {
            _id: refreshPayload._id,
            email: refreshPayload.email,
            role: refreshPayload.role,
            authProvider: refreshPayload.authProvider,
            username: refreshPayload.username,
          };

          const newAccessToken = generateToken(newPayload);
          const newRefreshToken = generateRefreshToken(newPayload);

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
          });

          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          next();
        } catch (refreshError) {
          throw ApiError.unauthorized(
            "Invalid refresh token. Please login again"
          );
        }
      } else {
        throw error;
      }
    }
  });
