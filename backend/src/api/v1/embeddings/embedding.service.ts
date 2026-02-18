import axios from "axios";
import EmbeddingModel from "../../../model/embeddingModel";
import { env } from "../../../config/env";
import { SematicMatch } from "../chatbot/sematic.dto";
import { logger } from "../../../utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type TableName = SematicMatch["tableName"];
// ─── Cosine Similarity ────────────────────────────────────────────────────────
// Alternatif $vectorSearch Atlas — jalan di MongoDB local/Docker
// Hitung kemiripan dua vector: hasil 0.0 (tidak mirip) - 1.0 (identik)
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ─── Service ──────────────────────────────────────────────────────────────────
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

  // ─── Generate Single Embedding ──────────────────────────────────────────────
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
        { texts: [text] },
        { timeout: 180_000 },
      );

      // const embedding = res.data?.data?.[0]?.embedding;
      const embedding = res.data?.embeddings?.[0];

      if (!Array.isArray(embedding)) {
        throw new Error("Invalid embedding response format");
      }

      if (embedding.length !== this.dimension) {
        throw new Error(`Embedding dimension mismatch: ${embedding.length}`);
      }

      return embedding.map(Number);
    } catch (err: any) {
      console.error(
        "Embedding service error:",
        err.response?.data || err.message,
      );
      throw new Error(`Embedding service unavailable: ${err.message}`);
    }
  }

  // ─── Generate Multiple Embeddings ───────────────────────────────────────────
  async genereateEmbeddings(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const res = await axios.post(`${this.baseUrl}/embed`, { texts });
    // const res = await axios.post(`${this.baseUrl}/v1/embeddings`, { texts });
    return res.data.embeddings;
  }

  // ─── Semantic Search (auto switch Atlas / Fallback) ──────────────────────────
  async semanticSearch(
    query: string,
    tableName: TableName[],
    limit = 5,
    minScore = 0.5,
  ): Promise<SematicMatch[]> {
    if (env.USE_ATLAS_VECTOR_SEARCH === true) {
      return this._searchAtlas(query, tableName, limit, minScore);
    }
    const result = await this._searchFallback(
      query,
      tableName,
      limit,
      minScore,
    );
    logger.debug(`RESULT SEMANTIC SEARCH: ${JSON.stringify(result)}`);
    return result;
  }

  // ─── Atlas $vectorSearch ────────────────────────────────────────────────────
  // Hanya jalan di MongoDB Atlas (butuh Vector Index "vector_index")
  private async _searchAtlas(
    query: string,
    tableName: TableName[],
    limit: number,
    minScore: number,
  ): Promise<SematicMatch[]> {
    const queryVector = await this.generateEmbedding(query);

    const results = await EmbeddingModel.aggregate<SematicMatch>([
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

    return results.filter((r) => r.similarity >= minScore);
  }

  // ─── Fallback: Cosine Similarity ────────────────────────────────────────────
  // Jalan di MongoDB local/Docker — tanpa Atlas
  // Ambil semua vector dari DB, hitung similarity di Node.js
  private async _searchFallback(
    query: string,
    tableName: TableName[],
    limit: number,
    minScore: number,
  ): Promise<SematicMatch[]> {
    const queryVector = await this.generateEmbedding(query);

    logger.debug(`queryVector ${queryVector}`);
    logger.debug(`tableName : ${tableName}`);
    logger.debug(`limit : ${limit}`);
    logger.debug(`minScore : ${minScore}`);

    // Ambil hanya field yang dibutuhkan — hemat memory
    const docs = await EmbeddingModel.find(
      { tableName: { $in: tableName } },
      { rowId: 1, tableName: 1, vector: 1, _id: 0 },
    ).lean<{ rowId: string; tableName: TableName; vector: number[] }[]>();

    const scored = docs.map((doc) => ({
      rowId: doc.rowId,
      tableName: doc.tableName,
      similarity: cosineSimilarity(queryVector, doc.vector),
    }));

    logger.debug(
      `Scores before filter: ${JSON.stringify(scored.map((d) => ({ rowId: d.rowId, similarity: d.similarity })))}`,
    );

    return docs
      .map((doc) => ({
        rowId: doc.rowId,
        tableName: doc.tableName,
        similarity: cosineSimilarity(queryVector, doc.vector),
      }))
      .filter((doc) => doc.similarity >= minScore)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
}

export const EmbeddingServiceInstance = new EmbeddingService();
