import express, { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import NewsService from "../service/newsService.js";

const router = express.Router();
const newsService = new NewsService();

// Get all news
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await newsService.getAll(Number(page), Number(limit));
    res.json(result);
  })
);

// Get news by category
router.get(
  "/category/:category",
  asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await newsService.getByCategory(
      req.params.category,
      Number(page),
      Number(limit)
    );
    res.json(result);
  })
);

// Create news
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await newsService.create(req.body);
    res.json(result);
  })
);

// Update news
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await newsService.update(req.params.id, req.body);
    res.json(result);
  })
);

// Delete news
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await newsService.delete(req.params.id);
    res.json(result);
  })
);

export default router;
