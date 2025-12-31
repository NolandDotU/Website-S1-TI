"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const process_1 = require("process");
const systemSettingSchema = new mongoose_1.default.Schema({
    isMaintenance: {
        type: Boolean,
        default: false,
    },
    theme: {
        type: String,
        default: "light",
        enum: ["light", "dark"],
    },
    SystemInfo: {
        version: {
            type: String,
            default: "1.0.0",
        },
        env: {
            type: String,
            default: process_1.env.NODE_ENV,
        },
        developerContanct: {
            type: String,
            default: "josephsebastian2505@gmail.com",
        },
    },
}, { timestamps: true });
const SystemSettingModel = mongoose_1.default.model("settings_collection", systemSettingSchema);
exports.default = SystemSettingModel;
//# sourceMappingURL=SystemSettingModel.js.map