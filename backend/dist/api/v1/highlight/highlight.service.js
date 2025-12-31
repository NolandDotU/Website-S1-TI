"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
const highlightModel_1 = require("../../../model/highlightModel");
const utils_2 = require("../../../utils");
const redis_1 = require("../../../config/redis");
class HighlightService {
    constructor(model = highlightModel_1.HighlightModel, cache) {
        this.model = model;
        this.cache = cache || new utils_2.CacheManager((0, redis_1.getRedisClient)());
    }
    async create(data) {
        const count = await this.model.countDocuments();
        if (count + data.length > 4) {
            throw utils_1.ApiError.conflict("Highlight limit exceeded (max 4)");
        }
        const highlights = await this.model.create(data);
        await this.cache.incr("highlights:version");
        return highlights;
    }
    async getAll() {
        const cacheVersion = (await this.cache.get("highlights:version")) || "0";
        const cacheKey = `highlights:v${cacheVersion}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            utils_1.logger.debug(`Cache HIT: ${cacheKey}`);
            return cached;
        }
        const data = await this.model
            .find({})
            .sort({ origin: 1 })
            .populate("contentId");
        await this.cache.set(cacheKey, data, 300);
        return data;
    }
    async getById(id) {
        const cacheKey = `highlights:item:${id}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            utils_1.logger.debug(`Cache HIT: ${cacheKey}`);
            return cached;
        }
        const highlight = await this.model.findById(id).populate("contentId");
        if (!highlight) {
            throw utils_1.ApiError.notFound("Highlight not found");
        }
        await this.cache.set(cacheKey, highlight, 300);
        return highlight;
    }
    async delete(id) {
        const highlight = await this.model.findByIdAndDelete(id);
        if (!highlight) {
            throw utils_1.ApiError.notFound("Highlight not found");
        }
        await this.cache.incr("highlights:version");
        await this.cache.del(`highlights:item:${id}`);
        return highlight;
    }
    async deleteAll() {
        const result = await this.model.deleteMany({});
        await this.cache.incr("highlights:version");
        return result;
    }
}
const highlightService = new HighlightService();
exports.default = highlightService;
//# sourceMappingURL=highlight.service.js.map