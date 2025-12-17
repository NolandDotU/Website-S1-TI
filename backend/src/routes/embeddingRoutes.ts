import express from "express";
import { embeddingServiceInstance } from "../service/embeddingService";
import NewsModel from "../model/newsModel";

const router = express.Router();

router.post("/news", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "question required" });
  }

  const matches = await embeddingServiceInstance.semanticSearch(
    question,
    "news",
    5
  );

  const ids = matches.map((m: any) => m.rowId);

  const news = await NewsModel.find({ _id: { $in: ids } });

  res.json({
    question,
    context: news.map(n => ({
      title: n.title,
      content: n.content,
    })),
  });
});

export default router;
