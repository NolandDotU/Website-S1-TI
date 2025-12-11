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

declare global {
  namespace Express {
    interface Request {
      user?: DecodedJWT;
    }
  }
}

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check multiple sources for token
    const accessToken =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!accessToken) {
      throw ApiError.unauthorized("Access token required");
    }

    try {
      const payload = verifyToken(accessToken);
      req.user = payload;
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

          req.user = verifyToken(newAccessToken);
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
  }
);

export const authorize = (...roles: string[]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Access denied. Required roles: ${roles.join(", ")}`
      );
    }

    next();
  });

// Optional: Middleware to require specific permissions
// export const requirePermissions = (...permissions: string[]) =>
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       throw ApiError.unauthorized("Authentication required");
//     }

//     const userPermissions = req.user.permissions || [];

//     const hasPermission = permissions.every((permission) =>
//       userPermissions.includes(permission)
//     );

//     if (!hasPermission) {
//       throw ApiError.forbidden(
//         `Insufficient permissions. Required: ${permissions.join(", ")}`
//       );
//     }

//     next();
//   });
