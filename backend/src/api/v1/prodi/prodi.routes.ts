import { Router } from "express";
import { ProdiController } from "./prodi.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { uploadProdiPhoto, validateImage, optimizeImage, handleMulterError } from "../../../middleware/uploads.middleware";

let controller: ProdiController | null = null;
const getController = () => {
  if (!controller) {
    controller = new ProdiController();
  }
  return controller;
};

const router = Router();

// Public route to get prodi profile
router.get("/", getController().getProfile);

// Admin route to update prodi profile
router.put(
  "/",
  authMiddleware(["admin"]),
  getController().updateProfile
);

// Admin route to upload sertifikat
router.post(
  "/sertifikat",
  authMiddleware(["admin"]),
  uploadProdiPhoto,
  validateImage,
  optimizeImage,
  handleMulterError,
  getController().uploadSertifikat
);

export default router;
