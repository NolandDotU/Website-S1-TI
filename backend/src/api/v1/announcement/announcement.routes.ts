import express from "express";
import { AnnouncementSchema, StatusSchema } from "./announcement.validation";
import { validate } from "../../../middleware/validate.middleware";
import { NewsController } from "./announcement.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { globalLimiter } from "../../../middleware/rateLimiter.middleware";
import {
  uploadNewsPhoto,
  handleMulterError,
  optimizeImage,
  validateImage,
  deleteImage,
} from "../../../middleware/uploads.middleware";
import { ApiResponse, logger } from "../../../utils";

const router = express.Router();

let controller: NewsController | null = null;
const getController = () => {
  if (!controller || controller == null) {
    controller = new NewsController();
  }
  return controller;
};

router.post(
  "/uploads",
  uploadNewsPhoto,
  handleMulterError,
  validateImage,
  optimizeImage,
  (req: any, res: any) => {
    logger.info("Image uploaded successfully", req.file);

    const filePath = `/uploads/news/${req.file?.filename}`;
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

router.delete("/uploads", (req, res, next) => {
  deleteImage(req.body.path).then(() => {
    res.send(ApiResponse.success(null, "Image deleted successfully", 200));
  });
});

router.get("/", (req, res, next) => {
  getController().getAllPublished(req, res, next);
});

router.get("/admin", authMiddleware(["admin", "hmp"]), (req, res, next) => {
  getController().getAllContent(req, res, next);
});

router.post(
  "/",
  authMiddleware(["admin", "hmp"]),
  validate(AnnouncementSchema),
  (req, res, next) => {
    getController().create(req, res, next);
  },
);

router.get("/:id", (req, res, next) => {
  getController().getById(req, res, next);
});

router.put(
  "/:id",
  // globalLimiter,
  authMiddleware(["admin", "hmp"]),
  validate(AnnouncementSchema),
  (req, res, next) => {
    getController().update(req, res, next);
  },
);

router.patch(
  "/:id/:status",
  authMiddleware(["admin", "hmp"]),
  validate(StatusSchema),
  (req, res, next) => {
    getController().updateStatus(req, res, next);
  },
);

router.delete(
  "/permanent/:id",
  authMiddleware(["admin", "hmp"]),
  (req, res, next) => {
    getController().delete(req, res, next);
  },
);

router.patch("/:id", authMiddleware(null), (req, res, next) => {
  getController().increamentView(req, res, next);
});

export default router;
