import EmbeddingModel from "../model/embeddingModel";
import { embeddingServiceInstance } from "./embeddingService";
import { env } from "../config/env";

export class embeddingInsertService {
  static async upsertOne(
    tableName: string,
    rowId: string,
    content: string
  ) {
    if (!content.trim()) return;

    const vector = await embeddingServiceInstance.generateEmbedding(content);
    if (!vector) return;

    if (vector.length !== env.EMBEDDING_DIMENSION) {
      throw new Error(`Embedding dimension invalid: ${vector.length}`);
    }

    await EmbeddingModel.findOneAndUpdate(
      { tableName, rowId },
      {
        tableName,
        rowId,
        content,
        vector,
      },
      { upsert: true, new: true }
    );
  }
}

export default embeddingInsertService;