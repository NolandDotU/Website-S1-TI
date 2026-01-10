import express from "express";
import { globalLimiter } from "../../middleware/rateLimiter.middleware";
import lecturerRoutes from "./lecturer/lecturer.routes";
import announcementRoutes from "./announcement/announcement.routes";
import authRoutes from "./auth/auth.routes";
import highlightRoutes from "./highlight/highlight.routes";
import historyRoutes from "./history/history.routes";
import dashboardRoutes from "./dashboard/dashboard.routes";

import ragRoutes from "../../routes/ragRoutes";

const router = express.Router();

//chat routes
router.use("/chat", ragRoutes);

router.use(globalLimiter);
router.use("/lecturers", lecturerRoutes);
router.use("/announcements", announcementRoutes);
router.use("/auth", authRoutes);
router.use("/highlight", highlightRoutes);
router.use("/history", historyRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
