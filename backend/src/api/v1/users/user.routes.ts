import { Router } from "express";
import { globalLimiter } from "../../../middleware/rateLimiter.middleware";
import { UserController } from "./user.controller";

let controller: UserController | null = null;
const getController = () => {
  if (!controller) {
    controller = new UserController();
  }
  return controller;
};
