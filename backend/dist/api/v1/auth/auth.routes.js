"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const auth_dto_1 = require("./auth.dto");
const validate_middleware_1 = require("../../../middleware/validate.middleware");
const utils_1 = require("../../../utils");
const uploads_middleware_1 = require("../../../middleware/uploads.middleware");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../../config/env");
const router = express_1.default.Router();
router.get("/me", (0, auth_middleware_1.authMiddleware)(null), auth_controller_1.default.checkMe);
router.post("/uploads", (0, auth_middleware_1.authMiddleware)(["admin"]), uploads_middleware_1.uploadUserPhoto, uploads_middleware_1.handleMulterError, uploads_middleware_1.validateImage, uploads_middleware_1.optimizeImage, (req, res) => {
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
//admin
router.get("/admin", (0, auth_middleware_1.authMiddleware)(["admin"]), auth_controller_1.default.checkMe);
router.post("/new/admin", (0, validate_middleware_1.validate)(auth_dto_1.AdminRegisterSchema), (0, auth_middleware_1.authMiddleware)(["admin"]), auth_controller_1.default.createAdmin);
// Google
router.post("/admin", auth_controller_1.default.adminLogin);
router.get("/google", auth_controller_1.default.googleAuth);
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: `${env_1.env.FRONTEND_ORIGIN}/auth/google/error`,
    session: false,
}), auth_controller_1.default.googleAuthCallback);
router.get("/google/failure", (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
});
// Logout
router.post("/logout", auth_controller_1.default.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map