import express from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { LocalLoginSchema, AdminRegisterSchema } from "./auth.dto";
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
      "Image uploaded successfully",
    );

    return res.status(response.statusCode).json(response);
  },
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
  authController.createAdmin,
);

// Local Login
router.post("/login", validate(LocalLoginSchema), authController.localLogin);

// Logout
router.post("/logout", authController.logout);

export default router;
