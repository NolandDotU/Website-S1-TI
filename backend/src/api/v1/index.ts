import express from "express";
import { globalLimiter } from "../../middleware/rateLimiter.middleware";
import lecturerRoutes from "./lecturer/lecturer.routes";
import announcementRoutes from "./announcement/announcement.routes";
import authRoutes from "./auth/auth.routes";
import highlightRoutes from "./highlight/highlight.routes";
import historyRoutes from "./history/history.routes";
import dashboardRoutes from "./dashboard/dashboard.routes";
import userRoutes from "./users/user.routes";
import partnerRoutes from "./partner/partner.routes";
import knowledgeRoutes from "./knowledge/knowledge.routes";

import ragRoutes from "./chatbot/rag.routes";

const router = express.Router();

//chat routes
router.use("/chat", ragRoutes);

// router.use(globalLimiter);
router.use("/lecturers", lecturerRoutes);
router.use("/announcements", announcementRoutes);
router.use("/auth", authRoutes);
router.use("/highlight", highlightRoutes);
router.use("/history", historyRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/user", userRoutes);
router.use("/partners", partnerRoutes);
router.use("/knowledge", knowledgeRoutes);

export default router;
