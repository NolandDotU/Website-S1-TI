import { authMiddleware } from "../../../middleware/auth.middleware";
import highlightService from "./highlight.service";
import express, { Request, Response } from "express";
import { ApiResponse, logger } from "../../../utils";
import { globalLimiter } from "../../../middleware/rateLimiter.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { CreateHighlightSchema } from "./highlight.dto";
import { HighlightController } from "./highlight.controller";
import {
  deleteImage,
  handleMulterError,
  optimizeImage,
  uploadCarouselPhoto,
  validateImage,
} from "../../../middleware/uploads.middleware";

const router = express.Router();

let controller: HighlightController | null;

const getController = () => {
  if (controller == null) {
    controller = new HighlightController(highlightService);
  }
  return controller;
};

router.post(
  "/uploads",
  uploadCarouselPhoto,
  handleMulterError,
  validateImage,
  optimizeImage,
  (req: any, res: any) => {
    logger.info("Image uploaded successfully", req.file);
    const filePath = `/uploads/highlights/${req.file?.filename}`;

    const response = ApiResponse.success(
      {
        path: filePath,
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

router.get("/", globalLimiter, getController().getAll);
router.post(
  "/",
  globalLimiter,
  authMiddleware(["admin"]),
  validate(CreateHighlightSchema),
  getController().create
);
router.delete(
  "/:id",
  globalLimiter,
  authMiddleware(["admin"]),
  getController().delete
);
router.delete(
  "/clear",
  globalLimiter,
  authMiddleware(["admin"]),
  getController().clear
);

export default router;
