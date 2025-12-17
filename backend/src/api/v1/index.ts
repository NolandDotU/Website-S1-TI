import express from "express";
import { globalLimiter } from "../../middleware/rateLimiter.middleware";
import lecturerRoutes from "./lecturer/lecturer.routes";
import newsRoutes from "../../routes/newsRoutes";

import debugEmbeddingRoutes from "../../routes/debugEmbeddingRoutes"
import debugHFRoutes from "../../routes/debugHFRoutes"

const router = express.Router();

router.use(globalLimiter);
router.use("/lecturers", lecturerRoutes);

router.use("/news", newsRoutes);

//test embedding
router.use("/debug", debugEmbeddingRoutes);
router.use("/debug", debugHFRoutes);

export default router;
