"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const announcement_validation_1 = require("./announcement.validation");
const validate_middleware_1 = require("../../../middleware/validate.middleware");
const announcement_controller_1 = require("./announcement.controller");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const rateLimiter_middleware_1 = require("../../../middleware/rateLimiter.middleware");
const uploads_middleware_1 = require("../../../middleware/uploads.middleware");
const utils_1 = require("../../../utils");
const router = express_1.default.Router();
let controller = null;
const getController = () => {
    if (!controller || controller == null) {
        controller = new announcement_controller_1.NewsController();
    }
    return controller;
};
router.post("/uploads", uploads_middleware_1.uploadNewsPhoto, uploads_middleware_1.handleMulterError, uploads_middleware_1.validateImage, uploads_middleware_1.optimizeImage, (req, res) => {
    utils_1.logger.info("Image uploaded successfully", req.file);
    const response = utils_1.ApiResponse.success({
        path: req.file?.path,
        filename: req.file?.filename,
    }, "Image uploaded successfully");
    return res.status(response.statusCode).json(response);
});
router.delete("/uploads", (req, res, next) => {
    (0, uploads_middleware_1.deleteImage)(req.body.path).then(() => {
        utils_1.ApiResponse.success(null, "Image deleted successfully", 200);
    });
});
router.get("/", rateLimiter_middleware_1.globalLimiter, (req, res, next) => {
    getController().getAllPublished(req, res, next);
});
router.get("/admin", (0, auth_middleware_1.authMiddleware)(["admin"]), (req, res, next) => {
    getController().getAllContent(req, res, next);
});
router.post("/", (0, auth_middleware_1.authMiddleware)(["admin"]), (0, validate_middleware_1.validate)(announcement_validation_1.AnnouncementSchema), (req, res, next) => {
    getController().create(req, res, next);
});
router.get("/:id", (req, res, next) => {
    getController().getById(req, res, next);
});
router.put("/:id", rateLimiter_middleware_1.globalLimiter, (0, auth_middleware_1.authMiddleware)(["admin"]), (0, validate_middleware_1.validate)(announcement_validation_1.AnnouncementSchema), (req, res, next) => {
    getController().update(req, res, next);
});
router.put("/:id/publish", rateLimiter_middleware_1.globalLimiter, (0, auth_middleware_1.authMiddleware)(["admin"]), (req, res, next) => {
    getController().publish(req, res, next);
});
router.delete("/permanent/:id", (0, auth_middleware_1.authMiddleware)(["admin"]), (req, res, next) => {
    getController().delete(req, res, next);
});
exports.default = router;
//# sourceMappingURL=announcement.routes.js.map