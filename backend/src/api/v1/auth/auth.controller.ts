import authService from "./auth.service";
import { Request, Response } from "express";
import passport from "passport";
import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiResponse, logger, verifyToken } from "../../../utils";
import { env } from "../../../config/env";
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
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  };

  checkMe = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    console.log("user : ", typeof user);

    if (!user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    // const currentUser = await this.service.checkMe(user.id);

    // return ApiResponse.success(currentUser, "User retrieved successfully", 200);
  });

  adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.service.adminLogin(req.body);
    logger.info("Admin logged in:", user);
    this.setCookies(res, user.accessToken, user.refreshToken);
    return res.send(
      ApiResponse.success(null, "Admin logged in successfully", 200)
    );
  });

  createAdmin = asyncHandler(async (req: Request, res: Response) => {
    if (process.env.NODE_ENV !== "development") throw ApiError.forbidden();
    const user = await this.service.createAdmin(req.body);
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
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.redirect(`${env.FRONTEND_ORIGIN}/auth/callback?success=true`);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("user");

    res.json(ApiResponse.success(null, "Logout berhasil"));
  });
}

const authController = new AuthController();
export default authController;
