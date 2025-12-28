import { authMiddleware } from "../../../middleware/auth.middleware";
import highlightService from "./highlight.service";
import express, { Request, Response } from "express";
import { logger } from "../../../utils";
import { globalLimiter } from "../../../middleware/rateLimiter.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { CreateHighlightSchema } from "./highlight.dto";
const router = express.Router();

let controller: typeof highlightService | null = null;

const getController = () => {
  if (controller == null) {
    controller = highlightService;
  }
  return controller;
};

router.get("/", globalLimiter, getController().getAll);
router.post(
  "/",
  globalLimiter,
  authMiddleware(["admin"]),
  validate(CreateHighlightSchema),
  getController().create
);
router.delete(
  "/:id",
  globalLimiter,
  authMiddleware(["admin"]),
  getController().delete
);
router.delete(
  "/",
  globalLimiter,
  authMiddleware(["admin"]),
  getController().deleteAll
);

export default router;
