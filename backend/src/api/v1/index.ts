import express from "express";
import { globalLimiter } from "../../middleware/rateLimiter.middleware";
import lecturerRoutes from "./lecturer/lecturer.routes";
import newsRoutes from "./news/news.routes";
import authRoutes from "./auth/auth.routes";
import highlightRoutes from "./highlight/highlight.routes";

const router = express.Router();

router.use("/lecturers", lecturerRoutes);
router.use("/news", newsRoutes);
router.use("/auth", authRoutes);
router.use("highlight", highlightRoutes);

export default router;
