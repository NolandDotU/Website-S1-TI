import express from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { AdminLoginDTO, AdminRegisterSchema } from "./auth.dto";
import { validate } from "../../../middleware/validate.middleware";
import { ApiResponse, logger } from "../../../utils";
import { globalLimiter } from "../../../middleware/rateLimiter.middleware";
import {
  deleteImage,
  handleMulterError,
  optimizeImage,
  validateImage,
  uploadUserPhoto,
} from "../../../middleware/uploads.middleware";
import authController from "./auth.controller";
import passport from "passport";
import { env } from "../../../config/env";

const router = express.Router();

router.get("/me", authMiddleware(null), authController.checkMe);
router.post(
  "/uploads",
  authMiddleware(["admin"]),
  uploadUserPhoto,
  handleMulterError,
  validateImage,
  optimizeImage,
  (req: any, res: any) => {
    logger.info("Image uploaded successfully", req.file);

    const response = ApiResponse.success(
      {
        path: req.file?.path,
        filename: req.file?.filename,
      },
      "Image uploaded successfully"
    );

    return res.status(response.statusCode).json(response);
  }
);

router.delete("/uploads", (req, res, next) => {
  deleteImage(req.body.path).then(() => {
    ApiResponse.success(null, "Image deleted successfully", 200);
  });
});

//admin
router.get("/admin", authMiddleware(["admin"]), authController.checkMe);
router.post(
  "/new/admin",
  validate(AdminRegisterSchema),
  authMiddleware(["admin"]),
  authController.createAdmin
);

// Google
router.post("/admin", authController.adminLogin);
router.get("/google", authController.googleAuth);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${env.FRONTEND_ORIGIN}/auth/google/error`,
    session: false,
  }),
  authController.googleAuthCallback
);
router.get("/google/failure", (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
});

// Logout
router.post("/logout", authController.logout);

export default router;
