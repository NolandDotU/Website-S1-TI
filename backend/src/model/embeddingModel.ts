import mongoose from "mongoose";

const embeddingSchema = new mongoose.Schema({
  tableName: { type: String, required: true, index: true },
  rowId: { type: String, required: true },
  content: { type: String, required: true },
  vector: { type: [Number], required: true },
}, { timestamps: true });

embeddingSchema.index(
  { tableName: 1, rowId: 1 },
  { unique: true }
);

const EmbeddingModel = mongoose.model("embeddings", embeddingSchema);
export default EmbeddingModel;
