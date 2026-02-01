import DashboardController from "./dashboard.controller";
import express from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { globalLimiter } from "../../../middleware/rateLimiter.middleware";

const router = express.Router();
let controller: DashboardController | null = null;

const getController = () => {
  if (!controller) {
    controller = new DashboardController();
  }
  return controller;
};

router.get(
  "/",
  // globalLimiter,
  authMiddleware(["admin", "hmp"]),
  (req, res, next) => {
    getController().getDashboard(req, res, next);
  },
);

export default router;
