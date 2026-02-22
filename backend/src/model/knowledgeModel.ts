import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["contact", "service"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: false,
      trim: true,
    },
    synonyms: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

knowledgeSchema.index({ kind: 1, title: 1 }, { unique: true });
knowledgeSchema.index({ title: "text", content: "text", synonyms: "text" });

const KnowledgeModel = mongoose.model("knowledge_collection", knowledgeSchema);

export default KnowledgeModel;
