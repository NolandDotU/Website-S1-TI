"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const utils_1 = require("../../../utils");
const announcement_service_1 = require("./announcement.service");
class NewsController {
    constructor() {
        this.service = new announcement_service_1.AnnouncementService();
        this.getAllPublished = (0, utils_1.asyncHandler)(async (req, res) => {
            const { page = 1, limit = 10, search = "", } = req.query;
            const result = await this.service.getAllPublished(Number(page), Number(limit), search);
            return utils_1.ApiResponse.success(result, "News fetched successfully", 200);
        });
        this.getAllContent = (0, utils_1.asyncHandler)(async (req, res) => {
            const { page = 1, limit = 10, search } = req.query;
            const result = await this.service.getAllPublished(Number(page), Number(limit), search);
            return utils_1.ApiResponse.success(result, "Content fetched successfully", 200);
        });
        this.create = (0, utils_1.asyncHandler)(async (req, res) => {
            // const userId = req.user?.id;
            const news = await this.service.create(req.body);
            return utils_1.ApiResponse.success(news, "News created successfully", 201);
        });
        this.getById = (0, utils_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const news = await this.service.getById(id);
            return utils_1.ApiResponse.success(news, "News fetched successfully", 200);
        });
        this.update = (0, utils_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const news = await this.service.update(req.body, id);
            return utils_1.ApiResponse.success(news, "News updated successfully", 200);
        });
        this.publish = (0, utils_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const result = await this.service.changeStatus(id, "published");
            return utils_1.ApiResponse.success(result, "News deactivated successfully", 200);
        });
        this.archive = (0, utils_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const result = await this.service.changeStatus(id, "archived");
            return utils_1.ApiResponse.success(result, "News activated successfully", 200);
        });
        this.delete = (0, utils_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const result = await this.service.delete(id);
            return utils_1.ApiResponse.success(result, "News deleted successfully", 200);
        });
    }
}
exports.NewsController = NewsController;
//# sourceMappingURL=announcement.controller.js.map