import axios from "axios";
import EmbeddingModel from "../model/embeddingModel";
import { env } from "../config/env";

export class EmbeddingService {
  private apiKey = env.HF_API_KEY;
  private baseUrl = env.HF_BASE_URL;
  private modelName = env.HF_MODEL_NAME;

  constructor() {
    if (!this.apiKey || !this.baseUrl || !this.modelName) {
      throw new Error("Missing embedding service configuration");
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!text.trim()) {
      throw new Error("Empty text for embedding");
    }

    try {
      const res = await axios.post(
        `${this.baseUrl}/v1/embeddings`,
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

      const embedding = res.data?.data?.[0]?.embedding;

      if (!Array.isArray(embedding)) {
        throw new Error("Invalid embedding response format");
      }

      if (embedding.length !== env.EMBEDDING_DIMENSION) {
        throw new Error(
          `Embedding dimension mismatch: ${embedding.length}`
        );
      }

      return embedding.map(Number);
    } catch (err: any) {
      console.error("Embedding service error:", err.response?.data || err.message);
      throw new Error("Embedding service unavailable");
    }
  }

  async semanticSearch(
    query: string,
    tableName: string,
    limit = 5,
    minScore = 0.75
  ) {
    const queryVector = await this.generateEmbedding(query);

    const results = await EmbeddingModel.aggregate([
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
    return results.filter(r => r.similarity >= minScore);
  }
}

export const EmbeddingServiceInstance = new EmbeddingService();
