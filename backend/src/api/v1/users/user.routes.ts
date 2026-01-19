import { Router } from "express";
import { globalLimiter } from "../../../middleware/rateLimiter.middleware";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { UserValidation } from "./user.dto";

let controller: UserController | null = null;
const getController = () => {
  if (!controller) {
    controller = new UserController();
  }
  return controller;
};

const router = Router();

router.get(
  "/",
  globalLimiter,
  authMiddleware(["admin"]),
  getController().getAllUser,
);
router.post(
  "/",
  globalLimiter,
  validate(UserValidation),
  authMiddleware(["admin"]),
  getController().newUser,
);

router.delete(
  "/:id",
  globalLimiter,
  authMiddleware(["admin"]),
  getController().deleteUser,
);

router.patch(
  "/nonactivate/:id",
  globalLimiter,
  authMiddleware(["admin"]),
  getController().nonactivate,
);
router.patch(
  "/activate/:id",
  globalLimiter,
  authMiddleware(["admin"]),
  getController().activate,
);

router.put(
  "/:id",
  globalLimiter,
  authMiddleware(["admin"]),
  getController().update,
);

export default router;
