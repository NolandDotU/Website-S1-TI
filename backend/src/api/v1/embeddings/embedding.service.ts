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

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }

  return dot; // karena sudah normalized
}

// ─── Service ──────────────────────────────────────────────────────────────────
export class EmbeddingService {
  private readonly apiKey: string;
  private readonly modelName: string;
  private readonly dimension: number;
  private readonly baseUrl = "https://api.jina.ai/v1/embeddings";

  constructor() {
    this.apiKey = env.JINA_API_KEY || "";
    this.modelName = env.JINA_MODEL || "jina-embeddings-v3";
    this.dimension = Number(env.EMBEDDING_DIMENSION);

    if (!this.apiKey) {
      logger.warn("[EmbeddingService] JINA_API_KEY not set – embedding calls will fail");
    } else {
      logger.info(
        `[EmbeddingService] initialized provider=jina model="${this.modelName}" dimension=${this.dimension}`,
      );
    }
  }

  /**
   * Call Jina AI Embeddings API.
   * @param texts  - array of texts to embed
   * @param task   - "retrieval.query" for search queries, "retrieval.passage" for document indexing
   */
  private async callJina(
    texts: string[],
    task: "retrieval.query" | "retrieval.passage" = "retrieval.query",
  ): Promise<number[][]> {
    const res = await axios.post(
      this.baseUrl,
      {
        model: this.modelName,
        input: texts,
        task,
        dimensions: this.dimension,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 60_000,
      },
    );

    const items = res.data?.data;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Empty response from Jina Embeddings API");
    }

    // Sort by index to preserve input order
    items.sort((a: any, b: any) => a.index - b.index);
    return items.map((item: any) => item.embedding);
  }

  // ─── Generate Single Embedding (for search queries) ─────────────────────────
  async generateEmbedding(text: string): Promise<number[]> {
    if (!text.trim()) {
      throw new Error("Empty text for embedding");
    }

    try {
      const [embedding] = await this.callJina([text], "retrieval.query");

      if (!Array.isArray(embedding)) {
        throw new Error("Invalid embedding response format");
      }

      if (embedding.length !== this.dimension) {
        throw new Error(
          `Embedding dimension mismatch: got ${embedding.length}, expected ${this.dimension}`,
        );
      }

      return embedding.map(Number);
    } catch (err: any) {
      logger.error(`[EmbeddingService] error: ${err.message}`);
      throw new Error(`Embedding service unavailable: ${err.message}`);
    }
  }

  // ─── Generate Multiple Embeddings (for document indexing) ───────────────────
  async genereateEmbeddings(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];
    return this.callJina(texts, "retrieval.passage");
  }

  // ─── Semantic Search (auto switch Atlas / Fallback) ──────────────────────────
  async semanticSearch(
    query: string,
    tableName: TableName[],
    limit = 5,
    minScore = 0.3,
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

    const filtered = results.filter((r) => r.similarity >= minScore);
    return filtered;
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

    const docs = await EmbeddingModel.find(
      { tableName: { $in: tableName } },
      { rowId: 1, tableName: 1, content: 1, vector: 1, _id: 0 },
    ).lean<
      {
        rowId: string;
        tableName: TableName;
        content: string;
        vector: number[];
      }[]
    >();

    const scored = docs.map((doc) => ({
      rowId: doc.rowId,
      tableName: doc.tableName,
      contentSnippet: (doc.content || "").slice(0, 80),
      similarity: cosineSimilarity(queryVector, doc.vector),
    }));

    const ranked = scored.sort((a, b) => b.similarity - a.similarity);

    return ranked
      .map((doc) => ({
        rowId: doc.rowId,
        tableName: doc.tableName,
        similarity: doc.similarity,
      }))
      .filter((doc) => doc.similarity >= minScore)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
}

export const EmbeddingServiceInstance = new EmbeddingService();
