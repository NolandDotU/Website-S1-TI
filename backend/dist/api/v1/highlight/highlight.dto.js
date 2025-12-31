"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHighlightSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const CustomContentSchema = zod_1.default.object({
    title: zod_1.default.string().min(1).max(100),
    description: zod_1.default.string().min(1).max(500),
    imageUrl: zod_1.default.string().url(),
    link: zod_1.default.string().url().optional(),
});
exports.CreateHighlightSchema = zod_1.default.object({
    type: zod_1.default.enum(["announcement", "custom"]),
    announcementId: zod_1.default.string().optional(),
    customContent: CustomContentSchema.optional(),
    order: zod_1.default.number().int().min(1),
});
//# sourceMappingURL=highlight.dto.js.map