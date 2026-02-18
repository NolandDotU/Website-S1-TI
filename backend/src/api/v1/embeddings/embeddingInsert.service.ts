import EmbeddingModel from "../../../model/embeddingModel";
import { EmbeddingServiceInstance } from "./embedding.service";
import { env } from "../../../config/env";

export class EmbeddingInsertService {
  static async upsertOne(tableName: string, rowId: string, content: string) {
    if (!content.trim()) {
      console.warn("Empty content, skip embedding");
      return;
    }

    const vector = await EmbeddingServiceInstance.generateEmbedding(content);
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
      { upsert: true, new: true },
    );
  }

  static async deleteOne(tableName: string, rowId: string): Promise<void> {
    await EmbeddingModel.deleteOne({ tableName, rowId });
  }
}

export default EmbeddingInsertService;
