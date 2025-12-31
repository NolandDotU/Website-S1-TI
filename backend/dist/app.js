"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("./config/cors");
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./utils/logger");
const v1_1 = __importDefault(require("./api/v1"));
const google_oauth_1 = require("./config/google-oauth");
const uploads_middleware_1 = require("./middleware/uploads.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// Security middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, compression_1.default)());
app.use(uploads_middleware_1.handleMulterError);
app.use((0, cookie_parser_1.default)());
(0, google_oauth_1.configureGoogleOAuth)();
// Body parsing
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Logging
app.use(logger_1.morganMiddleware);
// Health check
app.get("/health", (req, res) => {
    logger_1.logger.info("Health check");
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
// API routes
app.use("/api/v1", v1_1.default);
// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
// Global error handler
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map