"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementService = void 0;
const AnnouncementModel_1 = __importDefault(require("../../../model/AnnouncementModel"));
const redis_1 = require("../../../config/redis");
const utils_1 = require("../../../utils");
class AnnouncementService {
    constructor(model = AnnouncementModel_1.default, cache) {
        this.model = model;
        this.cache = cache || new utils_1.CacheManager((0, redis_1.getRedisClient)());
    }
    async getAllPublished(page = 1, limit = 20, search = "") {
        const skip = (page - 1) * limit;
        const cacheVersion = (await this.cache.get("news:version")) || "0";
        const normalizedSearch = search.trim().toLowerCase();
        const cacheKey = `news:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            utils_1.logger.info(`Cache HIT: ${cacheKey}`);
            return cached;
        }
        const searchQuery = search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ],
                status: "published",
            }
            : {};
        const docs = await this.model
            .find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const data = docs.map((doc) => doc.toJSON());
        await this.cache.set(cacheKey, data, 3600);
        return data;
    }
    async getAll(page = 1, limit = 10, search = "") {
        const skip = (page - 1) * limit;
        const cacheVersion = (await this.cache.get("news:version")) || "0";
        const normalizedSearch = search.trim().toLowerCase();
        const cacheKey = `news:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            utils_1.logger.info(`Cache HIT: ${cacheKey}`);
            return cached;
        }
        const searchQuery = search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ],
                status: "published",
            }
            : {};
        const docs = await this.model
            .find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const data = docs.map((doc) => doc.toJSON());
        await this.cache.set(cacheKey, data, 3600);
        return data;
    }
    async getById(id) {
        const cacheKey = `news:item:${id}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            utils_1.logger.info(`Cache HIT: ${cacheKey}`);
            return cached;
        }
        const newsDoc = await this.model.findById(id);
        if (!newsDoc)
            throw utils_1.ApiError.notFound("News not found");
        const data = newsDoc.toJSON();
        await this.cache.set(cacheKey, data, 3600);
        return data;
    }
    async create(data) {
        const exist = await this.model.findOne({ title: data.title });
        if (exist)
            throw utils_1.ApiError.conflict("News already exists");
        if (data.scheduleDate || data.scheduleDate !== null)
            data.status = "scheduled";
        const newsDoc = await this.model.create(data);
        await this.cache.incr("news:version");
        // await historyService.create({
        //   user:
        //   action: "create",
        //   entity: "announcement",
        //   entityId: newsDoc._id,
        //   description: `Announcement titled "${newsDoc.title}" was created.`,
        // });
        return newsDoc.toJSON();
    }
    async update(data, id) {
        const exist = await this.model.findOne({
            _id: { $ne: id },
            title: data.title,
        });
        if (exist)
            throw utils_1.ApiError.conflict("News already exists");
        const newsDoc = await this.model.findOneAndUpdate({ _id: id }, data, {
            new: true,
        });
        if (!newsDoc)
            throw utils_1.ApiError.notFound("News not found");
        await this.cache.incr("news:version");
        await this.cache.del(`news:item:${id}`);
        return newsDoc.toJSON();
    }
    async changeStatus(id, status) {
        const newsDoc = await this.model.findOneAndUpdate({ _id: id }, { status: "published" }, { new: true });
        if (!newsDoc)
            throw utils_1.ApiError.notFound("News not found");
        await this.cache.incr("news:version");
        await this.cache.del(`news:item:${id}`);
        return true;
    }
    async delete(id) {
        const newsDoc = await this.model.findOneAndDelete({ _id: id });
        if (!newsDoc)
            throw utils_1.ApiError.notFound("News not found");
        await this.cache.incr("news:version");
        await this.cache.del(`news:item:${id}`);
        return true;
    }
}
exports.AnnouncementService = AnnouncementService;
//# sourceMappingURL=announcement.service.js.map