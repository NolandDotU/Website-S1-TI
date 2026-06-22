import authService from "./auth.service";
import express from "express";
import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiResponse, JWTPayload } from "../../../utils";
import { chatHistoryService } from "../chatbot/chatHistory.service";
import { env } from "../../../config/env";

class AuthController {
  service = authService;

  private setCookies = (
    res: express.Response,
    accessToken: string,
    refreshToken: string,
  ) => {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 61 * 60 * 1000,
    });
  };

  checkMe = asyncHandler(async (req: express.Request, res: express.Response) => {
    const user = req.user as JWTPayload;
    const currentUser = await this.service.checkMe(user.id);

    return res.json(
      ApiResponse.success(currentUser, "User retrieved successfully", 200),
    );
  });

  localLogin = asyncHandler(async (req: express.Request, res: express.Response) => {
    const user = await this.service.localLogin(req.body);
    const guestId = req.cookies?.chatGuestId;

    if (guestId && user.user?.id) {
      await chatHistoryService.mergeGuestHistoryToUser(guestId, user.user.id);
      res.clearCookie("chatGuestId");
    }

    this.setCookies(res, user.accessToken, user.refreshToken);
    return res.send(
      ApiResponse.success(null, "Login berhasil", 200),
    );
  });

  createAdmin = asyncHandler(async (req: express.Request, res: express.Response) => {
    if (env.NODE_ENV !== "development") throw ApiError.forbidden();
    const currentUser = req.user as JWTPayload;
    const user = await this.service.createAdmin(req.body, currentUser);
    (res.json(ApiResponse.success(null, "Admin created successfully", 201)),
      201);
  });

  logout = asyncHandler(async (req: express.Request, res: express.Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("user");

    return res.send(ApiResponse.success(null, "Logout berhasil", 200));
  });
}

const authController = new AuthController();
export default authController;

