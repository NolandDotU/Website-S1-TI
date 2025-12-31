"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerService = void 0;
const lecturerModel_1 = require("../../../model/lecturerModel");
const index_1 = require("../../../utils/index");
const redis_1 = require("../../../config/redis");
class LecturerService {
    constructor(model = lecturerModel_1.LecturerModel, cache) {
        this.model = model;
        this.cache = cache || new index_1.CacheManager((0, redis_1.getRedisClient)());
        // ✅ HAPUS this.cache.flush() - ini bahaya banget!
    }
    async create(data) {
        const existing = await this.model.findOne({ email: data.email });
        if (existing) {
            throw index_1.ApiError.conflict("Lecturer already exists");
        }
        const lecturerDoc = await this.model.create(data);
        // ✅ Invalidate cache (safe, no-op kalau Redis mati)
        await this.cache.incr("lecturers:version");
        return lecturerDoc.toJSON();
    }
    async getAll(page = 1, limit = 10, search = "") {
        const skip = (page - 1) * limit;
        const cacheVersion = (await this.cache.get("lecturers:version")) || "0";
        const normalizedSearch = search.trim().toLowerCase();
        const cacheKey = `lecturers:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            index_1.logger.debug(`Cache HIT: ${cacheKey}`);
            return cached;
        }
        const searchQuery = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            }
            : {};
        const docs = await this.model
            .find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const data = docs.map((doc) => doc.toJSON());
        await this.cache.set(cacheKey, data, 3600); // 1 hour
        return data;
    }
    async getById(id) {
        const cacheKey = `lecturers:item:${id}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            index_1.logger.debug(`Cache HIT: ${cacheKey}`);
            return cached;
        }
        const lecturerDoc = await this.model.findById(id);
        if (!lecturerDoc) {
            throw index_1.ApiError.notFound("Lecturer not found");
        }
        const data = lecturerDoc.toJSON();
        await this.cache.set(cacheKey, data, 3600);
        return data;
    }
    async update(data, id) {
        if (!id) {
            throw index_1.ApiError.badRequest("Lecturer ID is required");
        }
        const lecturerDoc = await this.model.findOneAndUpdate({ _id: id }, data, {
            new: true,
        });
        if (!lecturerDoc) {
            throw index_1.ApiError.notFound("Lecturer not found");
        }
        await this.cache.incr("lecturers:version");
        await this.cache.del(`lecturers:item:${id}`);
        return lecturerDoc.toJSON();
    }
    async delete(id) {
        const lecturerDoc = await this.model.findOneAndDelete({
            $or: [{ _id: id }, { email: id }],
        });
        if (!lecturerDoc) {
            throw index_1.ApiError.notFound("Lecturer not found");
        }
        await this.cache.incr("lecturers:version");
        await this.cache.del(`lecturers:item:${id}`);
        return lecturerDoc.toJSON();
    }
}
exports.LecturerService = LecturerService;
//# sourceMappingURL=lecturer.service.js.map