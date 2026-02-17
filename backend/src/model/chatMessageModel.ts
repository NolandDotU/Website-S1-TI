import mongoose from "mongoose";

export type ChatOwnerType = "guest" | "user";
export type ChatRole = "user" | "assistant";

export interface IChatMessageInput {
  ownerType: ChatOwnerType;
  ownerId: string;
  sessionId: string;
  role: ChatRole;
  content: string;
}

export interface IChatMessage extends IChatMessageInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

chatMessageSchema.index({
  ownerType: 1,
  ownerId: 1,
  sessionId: 1,
  createdAt: 1,
});

const ChatMessageModel = mongoose.model<IChatMessage>(
  "chat_message_collection",
  chatMessageSchema,
);

export default ChatMessageModel;
