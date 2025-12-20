import express from "express";
import { AnnouncementSchema } from "./announcement.validation";
import { validate } from "../../../middleware/validate.middleware";
import { NewsController } from "./announcement.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { globalLimiter } from "../../../middleware/rateLimiter.middleware";

const router = express.Router();

let controller: NewsController | null = null;
const getController = () => {
  if (!controller || controller == null) {
    controller = new NewsController();
  }
  return controller;
};
router.get("/", globalLimiter, (req, res, next) => {
  getController().getAllPublished(req, res, next);
});

router.get("/admin", authMiddleware(["admin"]), (req, res, next) => {
  getController().getAllContent(req, res, next);
});

router.post(
  "/",
  authMiddleware(["admin"]),
  validate(AnnouncementSchema),
  (req, res, next) => {
    getController().create(req, res, next);
  }
);

router.get("/:id", (req, res, next) => {
  getController().getById(req, res, next);
});

router.put(
  "/:id",
  globalLimiter,
  authMiddleware(["admin"]),
  validate(AnnouncementSchema),
  (req, res, next) => {
    getController().update(req, res, next);
  }
);

router.put(
  "/:id/publish",
  globalLimiter,
  authMiddleware(["admin"]),
  (req, res, next) => {
    getController().publish(req, res, next);
  }
);
router.delete("/permanent/:id", authMiddleware(["admin"]), (req, res, next) => {
  getController().delete(req, res, next);
});

export default router;
