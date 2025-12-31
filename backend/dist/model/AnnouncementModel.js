"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const announcementSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100,
    },
    category: {
        type: String,
        required: true,
        enum: ["event", "lowongan", "pengumuman"],
    },
    content: {
        type: String,
        required: true,
    },
    link: String,
    photo: String,
    source: String,
    uploadDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "draft",
        enum: ["draft", "scheduled", "published", "archived"],
    },
    scheduleDate: {
        type: Date,
    },
    eventDate: Date,
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
announcementSchema.index({ title: 1 });
const AnnouncementModel = mongoose_1.default.model("announcement_collection", announcementSchema);
exports.default = AnnouncementModel;
//# sourceMappingURL=AnnouncementModel.js.map