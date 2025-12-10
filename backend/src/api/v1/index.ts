import express from "express";
import { globalLimiter } from "../../middleware/rateLimiter.middleware";
import lecturerRoutes from "./lecturer/lecturer.routes";

const router = express.Router();

router.use(globalLimiter);
router.use("/lecturers", lecturerRoutes);

export default router;
