import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["announcement", "custom"],
      required: true,
    },

    // kalau type = announcement
    announcementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "announcement_collection",
    },

    // kalau type = custom
    customContent: {
      title: String,
      description: String,
      imageUrl: String,
      link: String,
    },

    order: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

highlightSchema.index({ announcementId: 1 }, { unique: true, sparse: true });

export const HighlightModel = mongoose.model(
  "highlight_collection",
  highlightSchema
);
