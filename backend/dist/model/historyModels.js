"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Historyschema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
Historyschema.pre("validate", function (next) {
    this.entityModel = `${this.entity}_collection`;
});
const HistoryModel = mongoose_1.default.model("history_collection", Historyschema);
exports.default = HistoryModel;
//# sourceMappingURL=historyModels.js.map