import express from "express";
import { globalLimiter } from "../../middleware/rateLimiter.middleware";
import lecturerRoutes from "./lecturer/lecturer.routes";
import newsRoutes from "../../routes/newsRoutes";

import ragRoutes from "../../routes/ragRoutes";

const router = express.Router();

router.use(globalLimiter);
router.use("/lecturers", lecturerRoutes);

router.use("/news", newsRoutes);

//chat routes
router.use("/chat", ragRoutes);

export default router;
