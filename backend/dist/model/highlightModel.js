"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighlightModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const highlightSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ["announcement", "custom"],
        required: true,
    },
    // kalau type = announcement
    announcementId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
highlightSchema.index({ announcementId: 1 }, { unique: true, sparse: true });
exports.HighlightModel = mongoose_1.default.model("highlight_collection", highlightSchema);
//# sourceMappingURL=highlightModel.js.map