import { Request, Response, NextFunction } from "express";
import SystemSettingModel from "../model/SystemSettingModel";
import { verifyToken } from "../utils/jwt";
import { ApiResponse } from "../utils";

export const maintenanceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await SystemSettingModel.findOne();
    if (!settings || !settings.isMaintenance) {
      return next();
    }

    // Exempt paths that shouldn't be blocked even in maintenance (e.g. login, checking status)
    const exemptPaths = ["/api/v1/auth/login", "/api/v1/settings"];
    if (exemptPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    // Check if user is admin
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      try {
        const user = verifyToken(accessToken);
        if (user && user.role === "admin") {
          return next(); // Admin is allowed
        }
      } catch (err) {
        // Token invalid/expired, ignore and fall through to block
      }
    }

    // If we reach here, maintenance mode is ON and user is not an admin
    return res.status(503).json(ApiResponse.error("Service is currently under maintenance. Please try again later.", 503));
  } catch (error) {
    console.error("Maintenance middleware error:", error);
    return next();
  }
};
