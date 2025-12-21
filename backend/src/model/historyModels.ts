import mongoose from "mongoose";
import { ref } from "process";

export interface IHistoryInput {
  user: string | mongoose.Types.ObjectId;
  action: string;
  entity: string;
  entityId?: string | mongoose.Types.ObjectId;
  description?: string;
}

export interface IHistory extends IHistoryInput, mongoose.Document {
  datetime: Date;
  isArchive: boolean;
}
export interface IHistoryResponse extends IHistory {
  id: string | mongoose.Types.ObjectId;
  userData: {
    id: string;
    email: string;
    username: string;
    role: string;
    photo: string | null | undefined;
    authProvider: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const Historyschema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_collection",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["POST", "DELETE", "UPDATE", "PATCH", "AUTH"],
    },
    entity: {
      type: String,
      enum: ["lecturer", "announcement", "user", "settings", "highlight"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      refPath: "entityModel",
    },
    entityModel: {
      type: String,
    },
    description: {
      type: String,
      required: false,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
    datetime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

Historyschema.pre("validate", function (next) {
  this.entityModel = `${this.entity}_collection`;
});

const HistoryModel = mongoose.model<IHistory>(
  "history_collection",
  Historyschema
);
export default HistoryModel;
