"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterError = exports.uploadUserPhoto = exports.uploadNewsPhoto = exports.uploadLecturerPhoto = exports.deleteImage = exports.optimizeImage = exports.validateImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const crypto_1 = __importDefault(require("crypto"));
const sharp_1 = __importDefault(require("sharp"));
const file_type_1 = __importDefault(require("file-type")); // ✅ DEFAULT IMPORT
const utils_1 = require("../utils");
// ============================================
// VALIDATE IMAGE
// ============================================
const validateImage = async (req, res, next) => {
    try {
        if (!req.file)
            return next();
        const buffer = await promises_1.default.readFile(req.file.path);
        const type = await file_type_1.default.fromBuffer(buffer); // ✅ fileType.fromBuffer (bukan fileTypeFromBuffer)
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!type || !allowed.includes(type.mime)) {
            await promises_1.default.unlink(req.file.path);
            throw utils_1.ApiError.badRequest("Invalid image file");
        }
        next();
    }
    catch (error) {
        if (req.file)
            await promises_1.default.unlink(req.file.path).catch(() => { });
        next(error);
    }
};
exports.validateImage = validateImage;
// ============================================
// OPTIMIZE IMAGE
// ============================================
const optimizeImage = async (req, res, next) => {
    try {
        if (!req.file)
            return next();
        const outputPath = req.file.path.replace(/\.\w+$/, ".webp");
        await (0, sharp_1.default)(req.file.path)
            .resize(800, 800, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);
        await promises_1.default.unlink(req.file.path);
        req.file.path = outputPath;
        req.file.filename = path_1.default.basename(outputPath);
        next();
    }
    catch (error) {
        if (req.file)
            await promises_1.default.unlink(req.file.path).catch(() => { });
        next(utils_1.ApiError.internal("Failed to optimize image"));
    }
};
exports.optimizeImage = optimizeImage;
// ============================================
// DELETE IMAGE
// ============================================
const deleteImage = async (filePath) => {
    try {
        const baseDir = path_1.default.resolve("uploads");
        const targetPath = path_1.default.resolve(filePath);
        if (!targetPath.startsWith(baseDir)) {
            throw utils_1.ApiError.badRequest("Invalid file path");
        }
        await promises_1.default.access(targetPath);
        await promises_1.default.unlink(targetPath);
        return true;
    }
    catch (error) {
        if (error.code === "ENOENT") {
            return false;
        }
        throw error;
    }
};
exports.deleteImage = deleteImage;
// ============================================
// CREATE UPLOAD MIDDLEWARE
// ============================================
const createUpload = (destination, maxSize = 5 * 1024 * 1024) => {
    utils_1.logger.info(`Creating upload middleware for ${destination}`);
    const storage = multer_1.default.diskStorage({
        destination: async (req, file, cb) => {
            const uploadPath = path_1.default.join("uploads", destination);
            await promises_1.default.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueName = crypto_1.default.randomUUID();
            const ext = path_1.default.extname(file.originalname);
            cb(null, `${uniqueName}${ext}`);
        },
    });
    return (0, multer_1.default)({
        storage,
        limits: { fileSize: maxSize, files: 1 },
        fileFilter: (req, file, cb) => {
            const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error("Invalid file type"));
            }
        },
    }).single("photo");
};
// ============================================
// EXPORTS
// ============================================
exports.uploadLecturerPhoto = createUpload("lecturers", 5 * 1024 * 1024);
exports.uploadNewsPhoto = createUpload("news", 10 * 1024 * 1024);
exports.uploadUserPhoto = createUpload("users", 2 * 1024 * 1024);
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return next(utils_1.ApiError.badRequest("File size is too large"));
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return next(utils_1.ApiError.badRequest("Unexpected field"));
        }
    }
    if (err.message && err.message.includes("Invalid file type")) {
        return next(utils_1.ApiError.badRequest("Invalid file type"));
    }
    next(err);
};
exports.handleMulterError = handleMulterError;
//# sourceMappingURL=uploads.middleware.js.map