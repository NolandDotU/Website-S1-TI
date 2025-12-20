import express from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { AdminLoginDTO, AdminRegisterSchema } from "./auth.dto";
import { validate } from "../../../middleware/validate.middleware";
import authController from "./auth.controller";
import passport from "passport";

const router = express.Router();

router.get("/check", authMiddleware(["admin"]));

//admin
router.post("/admin", authController.adminLogin);
router.post(
  "/new/admin",
  validate(AdminRegisterSchema),
  authController.createAdmin
);

// Google
router.post("/login", authController.adminLogin);
router.get("/google", authController.googleAuth);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/google/failure",
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
