import express from "express";
import { globalLimiter } from "../../middleware/rateLimiter.middleware";
import lecturerRoutes from "./lecturer/lecturer.routes";
import newsRoutes from "./news/news.routes";
import authRoutes from "./auth/auth.routes";

const router = express.Router();

router.use(globalLimiter);
router.use("/lecturers", lecturerRoutes);
router.use("/news", newsRoutes);
router.use("/auth", authRoutes);

export default router;
