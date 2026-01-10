import mongoose from "mongoose";

export interface IHistoryInput {
  user: mongoose.Types.ObjectId;
  action: string;
  entity: string;
  entityId?: mongoose.Types.ObjectId;
  entityModel?: string;
  description?: string;
}

export interface IHistory extends IHistoryInput, mongoose.Document {
  datetime: Date;
  isArchive: boolean;
}
export interface IHistoryResponse extends IHistory {
  id: string | mongoose.Types.ObjectId;
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
      enum: ["POST", "DELETE", "UPDATE", "PATCH", "AUTH", "VIEW"],
    },
    entity: {
      type: String,
      enum: [
        "lecturer",
        "announcement",
        "user",
        "auth",
        "settings",
        "highlight",
      ],
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
  next();
});

const HistoryModel = mongoose.model<IHistory>(
  "history_collection",
  Historyschema
);
export default HistoryModel;
