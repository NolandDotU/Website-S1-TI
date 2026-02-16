import express from "express";
import { EmbeddingServiceInstance } from "./embedding.service";
import NewsModel from "../../../model/AnnouncementModel";

const router = express.Router();

router.post("/embedding", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question required" });
    }

    const matches = await EmbeddingServiceInstance.semanticSearch(
      question,
      ["announcement", "lecturer", "partners"],
      5
    );

    const idOrder = matches.map((m: any) => m.rowId);

    const newsDocs = await NewsModel.find({
      _id: { $in: idOrder },
    });

    // jaga urutan relevansi
    const ordered = idOrder
      .map((id) => newsDocs.find((n) => n._id.toString() === id))
      .filter(Boolean);

    res.json({
      question,
      context: ordered.map((n) => ({
        title: n?.title,
        content: n?.content.slice(0, 1_500), //batasi panjang konten
      })),
    });
  } catch (err: any) {
    res.status(500).json({
      error: err.message || "semantic search failed",
    });
  }
});

export default router;
