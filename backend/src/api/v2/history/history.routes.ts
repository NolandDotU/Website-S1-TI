import express, { Request, Response } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import historyService from "../../../utils/history";
import { ApiResponse, asyncHandler } from "../../../utils";

const router = express.Router();

router.get(
  "/",
  authMiddleware(["admin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search } = req.query as {
      page?: number;
      limit?: number;
      search?: string;
    };
    const data = await historyService.getAll(page, limit, search);
    res.send(ApiResponse.success(data, "History fetched successfully", 200));
  })
);

router.get(
  "/user",
  asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    const data = await historyService.getByUser(user);
    res.send(ApiResponse.success(data, "History fetched successfully", 200));
  })
);

export default router;
