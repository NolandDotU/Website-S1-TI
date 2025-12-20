import express, { Application } from "express";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import { corsOptions } from "./config/cors";
import { errorMiddleware } from "./middleware/error.middleware";
import { logger, morganMiddleware } from "./utils/logger";
import apiV1Router from "./api/v1";
import { configureGoogleOAuth } from "./config/google-oauth";
import multer from "multer";
import { handleMulterError } from "./middleware/uploads.middleware";

const app: Application = express();

// Security middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(compression());
app.use(handleMulterError);
configureGoogleOAuth();

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
app.use(morganMiddleware);

// Health check
app.get("/health", (req, res) => {
  logger.info("Health check");
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/v1", apiV1Router);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorMiddleware);

export default app;
