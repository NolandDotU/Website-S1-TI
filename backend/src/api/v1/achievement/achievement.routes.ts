import { Router } from "express";
import { AchievementController } from "./achievement.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { achievementValidation } from "./achievement.validation";
import {
  uploadAchievementPhoto,
  uploadCertificate,
  handleMulterError,
  optimizeImage,
  validateImage,
  validateDocument,
  deleteImage,
} from "../../../middleware/uploads.middleware";
import { ApiResponse, logger } from "../../../utils";

const router = Router();
const controller = new AchievementController();

// =======================
// UPLOADS
// =======================
router.post(
  "/uploads/image",
  authMiddleware(["admin"]),
  uploadAchievementPhoto,
  handleMulterError,
  validateImage,
  optimizeImage,
  (req: any, res: any) => {
    logger.info("Achievement Image uploaded successfully", req.file);
    const filePath = `/uploads/achievements/${req.file?.filename}`;
    const response = ApiResponse.success(
      { path: filePath, filename: req.file?.filename },
      "Image uploaded successfully",
    );
    return res.status(response.statusCode).json(response);
  },
);

router.post(
  "/uploads/certificate",
  authMiddleware(["admin"]),
  uploadCertificate,
  handleMulterError,
  validateDocument,
  (req: any, res: any) => {
    logger.info("Achievement Certificate uploaded successfully", req.file);
    const filePath = `/uploads/certificates/${req.file?.filename}`;
    const response = ApiResponse.success(
      { path: filePath, filename: req.file?.filename },
      "Certificate uploaded successfully",
    );
    return res.status(response.statusCode).json(response);
  },
);

// =======================
// PUBLIC
// =======================
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// =======================
// ADMIN
// =======================
router.post(
  "/",
  authMiddleware(["admin"]),
  validate(achievementValidation),
  controller.create,
);

router.put(
  "/:id",
  authMiddleware(["admin"]),
  validate(achievementValidation),
  controller.update,
);

router.delete("/:id", authMiddleware(["admin"]), controller.delete);

export default router;
