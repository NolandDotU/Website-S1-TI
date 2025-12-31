import express, { Request, Response } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import historyService from "../../../utils/history";
import { ApiResponse } from "../../../utils";

const router = express.Router();

router.get(
  "/",
  authMiddleware(["admin"]),
  async (req: Request, res: Response) => {
    const data = await historyService.getAll();
    res.send(ApiResponse.success(data, "History fetched successfully", 200));
  }
);
