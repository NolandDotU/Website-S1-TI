import axios from "axios";
import EmbeddingModel from "../../../model/embeddingModel";
import { env } from "../../../config/env";

export class EmbeddingService {
  //pakai yang di comment ini kalau mau pake hugging face
  // private apiKey = env.HF_API_KEY;
  // private baseUrl = env.HF_BASE_URL;
  // private modelName = env.HF_MODEL_NAME;
  // private dimension = Number(env.EMBEDDING_DIMENSION);

  // constructor() {
  //   if (!this.apiKey || !this.baseUrl || !this.modelName) {
  //     throw new Error("Missing embedding service configuration");
  //   }
  // }

  private baseUrl = env.EMBEDDING_BASE_URL;
  private dimension = Number(env.EMBEDDING_DIMENSION);

  async generateEmbedding(text: string): Promise<number[]> {
    if (!text.trim()) {
      throw new Error("Empty text for embedding");
    }

    try {
      // const res = await axios.post(
      //   `${this.baseUrl}/v1/embeddings`,
      //   {
      //     model: this.modelName,
      //     input: text,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${this.apiKey}`,
      //       "Content-Type": "application/json",
      //     },
      //     timeout: 180_000,
      //   }
      // );

      const res = await axios.post(
        `${this.baseUrl}/embed`,
        {
          texts: [text],
        },
        {
          timeout: 180_000,
        }
      );

      // const embedding = res.data?.data?.[0]?.embedding;
      const embedding = res.data?.embeddings?.[0];

      if (!Array.isArray(embedding)) {
        throw new Error("Invalid embedding response format");
      }

      if (embedding.length !== this.dimension) {
        throw new Error(
          `Embedding dimension mismatch: ${embedding.length}`
        );
      }

      return embedding.map(Number);
    } catch (err: any) {
      console.error("Embedding service error:", err.response?.data || err.message);
      throw new Error(`Embedding service unavaible: ${err.message}`);
    }
  }

  async genereateEmbeddings(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const res = await axios.post(`${this.baseUrl}/embed`, { texts });
    // const res = await axios.post(`${this.baseUrl}/v1/embeddings`, { texts });
    return res.data.embeddings;
  }

  async semanticSearch(
    query: string,
    tableName: string[],
    limit = 5,
    minScore = 0.5
  ) {
    const queryVector = await this.generateEmbedding(query);

    const results = await EmbeddingModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "vector",
          queryVector,
          numCandidates: 50,
          limit,
          filter: { tableName: { $in: tableName } },
        },
      },
      {
        $project: {
          rowId: 1,
          tableName: 1,
          similarity: { $meta: "vectorSearchScore" },
        },
      },
    ]);
    return results.filter(r => r.similarity >= minScore);
  }
}

export const EmbeddingServiceInstance = new EmbeddingService();
