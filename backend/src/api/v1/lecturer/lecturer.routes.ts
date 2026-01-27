import { Router } from "express";
import { LecturerController } from "./lecturer.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { LecturerValidation } from "./lecturer.validation";
import { globalLimiter } from "../../../middleware/rateLimiter.middleware";
import { ApiResponse, logger } from "../../../utils";
import {
  deleteImage,
  handleMulterError,
  optimizeImage,
  uploadLecturerPhoto,
  validateImage,
} from "../../../middleware/uploads.middleware";
const router = Router();

// Lazy initialization - only create instances when routes are actually called
let lecturerController: LecturerController | null = null;

const getController = (): LecturerController => {
  if (!lecturerController || lecturerController == null) {
    lecturerController = new LecturerController();
  }
  return lecturerController;
};

router.post(
  "/uploads",
  uploadLecturerPhoto,
  handleMulterError,
  validateImage,
  optimizeImage,
  (req: any, res: any) => {
    logger.info("Image uploaded successfully", req.file);
    const filePath = `/uploads/lecturers/${req.file?.filename}`;

    const response = ApiResponse.success(
      {
        path: filePath,
        filename: req.file?.filename,
      },
      "Image uploaded successfully",
    );

    return res.status(response.statusCode).json(response);
  },
);

// router.delete("/uploads", (req, res, next) => {
//   deleteImage(req.body.path).then(() => {
//     ApiResponse.success(null, "Image deleted successfully", 200);
//   });
// });

router.post(
  "/",
  authMiddleware(["admin"]),
  validate(LecturerValidation),
  (req, res, next) => {
    getController().create(req, res, next);
  },
);

router.get(
  "/",
  //  globalLimiter,
  authMiddleware(["admin"]),
  (req, res, next) => {
    getController().getAll(req, res, next);
  },
);
router.get(
  "/active",
  //  globalLimiter,
  (req, res, next) => {
    getController().getAllActive(req, res, next);
  },
);

router.get(
  "/detail",
  //  globalLimiter,
  authMiddleware(null),
  (req, res, next) => {
    getController().getByEmail(req, res, next);
  },
);

router.put("/:id", authMiddleware(["dosen", "admin"]), (req, res, next) => {
  getController().update(req, res, next);
});

router.delete("/:id", authMiddleware(["admin"]), (req, res, next) => {
  getController().delete(req, res, next);
});

export default router;
