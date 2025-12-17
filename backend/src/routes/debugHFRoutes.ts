import express from "express";
import axios from "axios";
import { env } from "../config/env";

const router = express.Router();

router.get("/hf-check", async (req, res) => {
  try {
    const response = await axios.post(
      `${env.HF_BASE_URL}/nebius/v1/embeddings`,
      {
        model: env.HF_MODEL_NAME,
        input: "test koneksi huggingface",
      },
      {
        headers: {
          Authorization: `Bearer ${env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30_000,
      }
    );

    res.json({
      status: "CONNECTED",
      embeddingLength: response.data?.data?.[0]?.embedding?.length ?? 0,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "FAILED",
      message: err.response?.data || err.message,
    });
  }
});

export default router;
