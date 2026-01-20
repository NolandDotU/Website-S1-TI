import express from "express";
import { PartnerController } from "./partner.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validate.middleware";
// import { PartnerValidation } from "./partner.validation";
import { globalLimiter } from "../../../middleware/rateLimiter.middleware";
import { ApiResponse, logger } from "../../../utils";
import {
  deleteImage,
  handleMulterError,
  optimizeImage,
  uploadLecturerPhoto,
  uploadPartnerPhoto,
  validateImage,
} from "../../../middleware/uploads.middleware";

const router = express.Router();
let controller: PartnerController | null = null;
const getController = (): PartnerController => {
  if (!controller || controller == null) {
    controller = new PartnerController();
  }
  return controller;
};

router.get("/", (req, res, next) => {
  getController().getAll(req, res, next);
});

router.post(
  "/uploads",
  authMiddleware(["admin"]),
  uploadPartnerPhoto,
  handleMulterError,
  validateImage,
  optimizeImage,
  (req: any, res: any) => {
    logger.info("Image uploaded successfully", req.file);
    const filePath = `/uploads/partners/${req.file?.filename}`;

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

router.delete("/:id", authMiddleware(["admin"]), async (req, res, next) => {});
