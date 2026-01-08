import express, { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import NewsService from "../service/newsService";
import { EmbeddingInsertService } from "../service/embeddingInsertService";

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
// router.post(
//   "/",
//   asyncHandler(async (req: Request, res: Response) => {
//     const result = await newsService.create(req.body);
//     res.json(result);
//   })
// );

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const news = await newsService.create(req.body);

    EmbeddingInsertService
      .upsertOne(
        "news",
        news._id.toString(),
        `${news.title}\n${news.category}\n${news.content}`
      )
      .catch(err => {
        console.error("[EMBEDDING FAILED]", news._id, err.message);
      });

    res.json(news);
  })
);

// Update news
// router.put(
//   "/:id",
//   asyncHandler(async (req: Request, res: Response) => {
//     const result = await newsService.update(req.params.id, req.body);
//     res.json(result);
//   })
// );

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const news = await newsService.update(req.params.id, req.body);

    EmbeddingInsertService
      .upsertOne(
        "news",
        news._id.toString(),
        `${news.title}\n${news.category}\n${news.content}`
      )
      .catch(console.error);

    res.json(news);
  })
);

// Delete news
// router.delete(
//   "/:id",
//   asyncHandler(async (req: Request, res: Response) => {
//     const result = await newsService.delete(req.params.id);
//     res.json(result);
//   })
// );

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await newsService.delete(req.params.id);

    await EmbeddingInsertService.deleteOne("news", req.params.id);

    res.json({ status: "OK" });
  })
)

export default router;
