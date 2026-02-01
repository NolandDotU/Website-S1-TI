import authService from "./auth.service";
import { Request, Response } from "express";
import passport from "passport";
import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiResponse, JWTPayload } from "../../../utils";
import { env } from "../../../config/env";
class AuthController {
  service = authService;

  private setCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) => {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 61 * 60 * 1000,
    });
  };

  checkMe = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as JWTPayload;
    const currentUser = await this.service.checkMe(user.id);

    return res.json(
      ApiResponse.success(currentUser, "User retrieved successfully", 200),
    );
  });

  localLogin = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.service.localLogin(req.body);
    this.setCookies(res, user.accessToken, user.refreshToken);
    return res.send(
      ApiResponse.success(null, "Admin logged in successfully", 200),
    );
  });

  createAdmin = asyncHandler(async (req: Request, res: Response) => {
    if (process.env.NODE_ENV !== "development") throw ApiError.forbidden();
    const currentUser = req.user as JWTPayload;
    const user = await this.service.createAdmin(req.body, currentUser);
    (res.json(ApiResponse.success(null, "Admin created successfully", 201)),
      201);
  });

  googleAuth = passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  });

  googleAuthCallback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect(
        `${env.FRONTEND_ORIGIN}/login?error=google_auth_failed`,
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
    res.redirect(`${env.FRONTEND_ORIGIN}/`);
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
