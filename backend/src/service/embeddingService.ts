import axios from "axios";
import EmbeddingModel from "../model/embeddingModel";
import { env } from "../config/env";

export class EmbeddingService {
  private apiKey = env.HF_API_KEY;
  private baseUrl = env.HF_BASE_URL;
  private modelName = env.HF_MODEL_NAME;

  async generateEmbedding(text: string): Promise<number[] | null> {
  
    if (!text.trim()) return null;

    try {
      const res = await axios.post(
        `${this.baseUrl}/nebius/v1/embeddings`,
        {
          model: this.modelName,
          input: text,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 180_000,
        }
      );

      const emb = res.data?.data?.[0]?.embedding;
      if (!Array.isArray(emb)) {
        throw new Error("Embedding format invalid");
      }

      return emb.map(Number);
    } catch (err) {
      console.error("HF embedding error:", err);
      return null;
    }
  }

  async semanticSearch(query: string, tableName: string, limit = 5) {
    const queryVector = await this.generateEmbedding(query);
    if (!queryVector) return [];

    return EmbeddingModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "vector",
          queryVector,
          numCandidates: 100,
          limit,
          filter: { tableName },
        },
      },
      {
        $project: {
          rowId: 1,
          similarity: { $meta: "vectorSearchScore" },
        },
      },
    ]);
  }
}

export const embeddingServiceInstance = new EmbeddingService();
