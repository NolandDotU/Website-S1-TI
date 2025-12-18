import express from "express";
import { NewsValidation } from "./news.validation";
import { validate } from "../../../middleware/validate.middleware";
import { NewsController } from "./news.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";

const router = express.Router();

let controller: NewsController | null = null;
const getController = () => {
  if (!controller || controller == null) {
    controller = new NewsController();
  }
  return controller;
};

router.get("/", (req, res, next) => {
  getController().getAll(req, res, next);
});
router.post(
  "/",
  authMiddleware(["admin"]),
  validate(NewsValidation),
  (req, res, next) => {
    getController().create(req, res, next);
  }
);

router.get("/:id", (req, res, next) => {
  getController().getById(req, res, next);
});

router.put(
  "/:id",
  authMiddleware(["admin"]),
  validate(NewsValidation),
  (req, res, next) => {
    getController().update(req, res, next);
  }
);

router.delete("/:id", authMiddleware(["admin"]), (req, res, next) => {
  getController().deactivate(req, res, next);
});

router.delete("/permanent/:id", authMiddleware(["admin"]), (req, res, next) => {
  getController().delete(req, res, next);
});

export default router;
