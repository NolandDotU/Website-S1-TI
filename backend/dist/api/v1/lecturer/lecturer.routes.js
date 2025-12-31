"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lecturer_controller_1 = require("./lecturer.controller");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const validate_middleware_1 = require("../../../middleware/validate.middleware");
const lecturer_validation_1 = require("./lecturer.validation");
const rateLimiter_middleware_1 = require("../../../middleware/rateLimiter.middleware");
const utils_1 = require("../../../utils");
const uploads_middleware_1 = require("../../../middleware/uploads.middleware");
const router = (0, express_1.Router)();
// Lazy initialization - only create instances when routes are actually called
let lecturerController = null;
const getController = () => {
    if (!lecturerController || lecturerController == null) {
        lecturerController = new lecturer_controller_1.LecturerController();
    }
    return lecturerController;
};
router.post("/uploads", uploads_middleware_1.uploadLecturerPhoto, uploads_middleware_1.handleMulterError, uploads_middleware_1.validateImage, uploads_middleware_1.optimizeImage, (req, res) => {
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
router.post("/", (0, auth_middleware_1.authMiddleware)(["admin"]), (0, validate_middleware_1.validate)(lecturer_validation_1.LecturerValidation), (req, res, next) => {
    getController().create(req, res, next);
});
router.get("/", rateLimiter_middleware_1.globalLimiter, (req, res, next) => {
    getController().getAll(req, res, next);
});
router.put("/:id", (0, auth_middleware_1.authMiddleware)(["admin"]), (req, res, next) => {
    getController().update(req, res, next);
});
router.delete("/:id", (0, auth_middleware_1.authMiddleware)(["admin"]), (req, res, next) => {
    getController().delete(req, res, next);
});
exports.default = router;
//# sourceMappingURL=lecturer.routes.js.map