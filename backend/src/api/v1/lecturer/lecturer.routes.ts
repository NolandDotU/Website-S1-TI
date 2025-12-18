import { Router } from "express";
import { LecturerController } from "./lecturer.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { LecturerValidation } from "./lecturer.validation";
const router = Router();

// Lazy initialization - only create instances when routes are actually called
let lecturerController: LecturerController | null = null;

const getController = (): LecturerController => {
  if (!lecturerController || lecturerController == null) {
    lecturerController = new LecturerController();
  }
  return lecturerController;
};
router.post(
  "/",
  authMiddleware(["admin"]),
  validate(LecturerValidation),
  (req, res, next) => {
    getController().create(req, res, next);
  }
);

router.get("/", (req, res, next) => {
  getController().getAll(req, res, next);
});

router.put("/:id", authMiddleware(["admin"]), (req, res, next) => {
  getController().update(req, res, next);
});

router.delete("/:id", authMiddleware(["admin"]), (req, res, next) => {
  getController().delete(req, res, next);
});

export default router;
