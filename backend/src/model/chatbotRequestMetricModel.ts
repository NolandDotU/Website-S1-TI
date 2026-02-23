import mongoose from "mongoose";

export type ChatbotRequestMode = "stream" | "non-stream";
export type ChatbotRequestStatus = "success" | "failed";
export type ChatbotResponseSource =
  | "intent"
  | "semantic_no_context"
  | "openrouter";

export interface IChatbotRequestMetric extends mongoose.Document {
  ownerType: "guest" | "user";
  ownerId: string;
  sessionId: string;
  mode: ChatbotRequestMode;
  status: ChatbotRequestStatus;
  source: ChatbotResponseSource;
  modelName?: string;
  attemptedModels: string[];
  fallbackUsed: boolean;
  fallbackCount: number;
  durationMs: number;
  errorCode?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatbotRequestMetricSchema = new mongoose.Schema(
  {
    ownerType: {
      type: String,
      enum: ["guest", "user"],
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["stream", "non-stream"],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
    source: {
      type: String,
      enum: ["intent", "semantic_no_context", "openrouter"],
      required: true,
    },
    modelName: {
      type: String,
      trim: true,
    },
    attemptedModels: {
      type: [String],
      default: [],
    },
    fallbackUsed: {
      type: Boolean,
      default: false,
    },
    fallbackCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    durationMs: {
      type: Number,
      required: true,
      min: 0,
    },
    errorCode: {
      type: String,
      trim: true,
    },
    errorMessage: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

chatbotRequestMetricSchema.index({ createdAt: -1 });
chatbotRequestMetricSchema.index({ status: 1, createdAt: -1 });
chatbotRequestMetricSchema.index({ ownerType: 1, ownerId: 1, createdAt: -1 });

const ChatbotRequestMetricModel = mongoose.model<IChatbotRequestMetric>(
  "chatbot_request_metric_collection",
  chatbotRequestMetricSchema,
);

export default ChatbotRequestMetricModel;
