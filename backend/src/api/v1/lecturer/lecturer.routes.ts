import { Router } from "express";
import { LecturerController } from "./lecturer.controller";
import { LecturerService } from "./lecturer.service";

const router = Router();

// Lazy initialization - only create instances when routes are actually called
let lecturerController: LecturerController | null = null;

const getController = (): LecturerController => {
  if (!lecturerController) {
    lecturerController = new LecturerController();
  }
  return lecturerController;
};
router.post("/", (req, res, next) => {
  getController().create(req, res, next);
});

router.get("/", (req, res, next) => {
  getController().getAll(req, res, next);
});

router.put("/:id", (req, res, next) => {
  getController().update(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  getController().delete(req, res, next);
});

export default router;
