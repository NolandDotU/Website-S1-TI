import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "news_collection",
    required: true,
  },
});

highlightSchema.index({ contentId: 1 }, { unique: true });

export const HighlightModel = mongoose.model(
  "highlight_collection",
  highlightSchema
);
