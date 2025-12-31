"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const highlight_service_1 = __importDefault(require("./highlight.service"));
const utils_1 = require("../../../utils");
class HighlightController {
    constructor(service = highlight_service_1.default) {
        this.service = service;
        this.create = (0, utils_1.asyncHandler)(async (req, res) => {
            const content = (Array.isArray(req.body) ? req.body : [req.body]);
            const highlight = await this.service.create(content);
            utils_1.logger.info("Highlight created successfully");
            res
                .status(201)
                .json(utils_1.ApiResponse.success(highlight, "Highlight created successfully", 201));
        });
        this.getAll = (0, utils_1.asyncHandler)(async (req, res) => {
            const highlight = await this.service.getAll();
            utils_1.logger.info("Highlight fetched successfully");
            res
                .status(200)
                .json(utils_1.ApiResponse.success(highlight, "Highlight fetched successfully"));
        });
        this.delete = (0, utils_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const highlight = await this.service.delete(id);
            utils_1.logger.info("Highlight deleted successfully");
            res
                .status(200)
                .json(utils_1.ApiResponse.success(highlight, "Highlight deleted successfully"));
        });
    }
}
//# sourceMappingURL=highlight.controller.js.map