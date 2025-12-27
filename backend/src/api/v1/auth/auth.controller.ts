import authService from "./auth.service";
import { request, Request, Response } from "express";
import passport from "passport";
import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiResponse, JWTPayload, logger, verifyToken } from "../../../utils";
import { env } from "../../../config/env";
import { JWTAlgorithm } from "zod/v4/core/util.cjs";
class AuthController {
  service = authService;

  private setCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
  ) => {
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

  checkMe = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies["accessToken"] || null;
    if (!token) {
      throw ApiError.unauthorized("User not authenticated");
    }
    const user = verifyToken(token);
    console.log("user : ", typeof user);

    if (!user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const currentUser = await this.service.checkMe(user.id);
    console.log("currentUser : ", currentUser);

    return res.send(
      ApiResponse.success(currentUser, "User retrieved successfully", 200)
    );
  });

  adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.service.adminLogin(req.body);
    logger.info("Admin logged in:", user);
    this.setCookies(res, user.accessToken, user.refreshToken);
    logger.info("Cookies set for admin login : ", res.cookie);
    return res.send(
      ApiResponse.success(null, "Admin logged in successfully", 200)
    );
  });

  createAdmin = asyncHandler(async (req: Request, res: Response) => {
    if (process.env.NODE_ENV !== "development") throw ApiError.forbidden();
    const currentUser = req.user as JWTPayload | undefined;
    logger.info("Current User creating admin:", currentUser);
    const user = await this.service.createAdmin(req.body, currentUser?.id);
    return ApiResponse.success(null, "Admin created successfully", 201);
  });

  googleAuth = passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  });

  googleAuthCallback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect(
        `${env.FRONTEND_ORIGIN}/login?error=google_auth_failed`
      );
    }

    const result = await authService.handleGoogleAuth(req.user);

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
    res.redirect(`${env.FRONTEND_ORIGIN}/auth/callback?success=true`);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("user");

    return res.send(ApiResponse.success(null, "Logout berhasil", 200));
  });
}

const authController = new AuthController();
export default authController;
