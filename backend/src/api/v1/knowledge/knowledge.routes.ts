import express from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { KnowledgeController } from "./knowledge.controller";
import {
  KnowledgeCreateSchema,
  KnowledgeUpdateSchema,
} from "./knowledge.validation";

const router = express.Router();

let controller: KnowledgeController | null = null;
const getController = () => {
  if (!controller || controller == null) {
    controller = new KnowledgeController();
  }
  return controller;
};

router.get("/", authMiddleware(["admin", "hmp"]), (req, res, next) => {
  getController().getAll(req, res, next);
});

router.get("/:id", authMiddleware(["admin", "hmp"]), (req, res, next) => {
  getController().getById(req, res, next);
});

router.post(
  "/",
  authMiddleware(["admin", "hmp"]),
  validate(KnowledgeCreateSchema),
  (req, res, next) => {
    getController().create(req, res, next);
  },
);

router.put(
  "/:id",
  authMiddleware(["admin", "hmp"]),
  validate(KnowledgeUpdateSchema),
  (req, res, next) => {
    getController().update(req, res, next);
  },
);

router.delete("/:id", authMiddleware(["admin", "hmp"]), (req, res, next) => {
  getController().delete(req, res, next);
});

export default router;
