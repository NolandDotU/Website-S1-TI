import { Router } from "express";
import { SettingsController } from "./settings.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";

let controller: SettingsController | null = null;
const getController = () => {
  if (!controller) {
    controller = new SettingsController();
  }
  return controller;
};

const router = Router();

// Public route to get settings (e.g. check maintenance mode)
router.get("/", getController().getSettings);

// Admin route to update settings (e.g. toggle maintenance mode)
router.put(
  "/",
  authMiddleware(["admin"]),
  getController().updateSettings
);

export default router;
