import multer from "multer";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import sharp from "sharp";
import fileType from "file-type"; // ✅ DEFAULT IMPORT
import { Request, Response, NextFunction } from "express";
import { ApiError, logger } from "../utils";

// ============================================
// VALIDATE IMAGE
// ============================================
export const validateImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return next();

    const buffer = await fs.readFile(req.file.path);
    const type = await fileType.fromBuffer(buffer); // ✅ fileType.fromBuffer (bukan fileTypeFromBuffer)
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!type || !allowed.includes(type.mime)) {
      await fs.unlink(req.file.path);
      throw ApiError.badRequest("Invalid image file");
    }

    next();
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    next(error);
  }
};

// ============================================
// OPTIMIZE IMAGE
// ============================================
export const optimizeImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return next();

    const outputPath = req.file.path.replace(/\.\w+$/, ".webp");

    await sharp(req.file.path)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    await fs.unlink(req.file.path);

    req.file.path = outputPath;
    req.file.filename = path.basename(outputPath);

    next();
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    next(ApiError.internal("Failed to optimize image"));
  }
};

// ============================================
// DELETE IMAGE
// ============================================
export const deleteImage = async (filePath: string) => {
  try {
    const baseDir = path.resolve("uploads");
    const targetPath = path.resolve(filePath);

    if (!targetPath.startsWith(baseDir)) {
      throw ApiError.badRequest("Invalid file path");
    }

    await fs.access(targetPath);
    await fs.unlink(targetPath);

    return true;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
};

// ============================================
// CREATE UPLOAD MIDDLEWARE
// ============================================
const createUpload = (destination: string, maxSize = 5 * 1024 * 1024) => {
  logger.info(`Creating upload middleware for ${destination}`);
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadPath = path.join("uploads", destination);
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = crypto.randomUUID();
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueName}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: maxSize, files: 1 },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"));
      }
    },
  }).single("photo");
};

// ============================================
// EXPORTS
// ============================================
export const uploadLecturerPhoto = createUpload("lecturers", 5 * 1024 * 1024);
export const uploadNewsPhoto = createUpload("news", 10 * 1024 * 1024);
export const uploadUserPhoto = createUpload("users", 2 * 1024 * 1024);

export const handleMulterError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(ApiError.badRequest("File size is too large"));
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(ApiError.badRequest("Unexpected field"));
    }
  }

  if (err.message && err.message.includes("Invalid file type")) {
    return next(ApiError.badRequest("Invalid file type"));
  }

  next(err);
};
