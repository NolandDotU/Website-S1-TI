"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../config/redis");
const historyModels_1 = __importDefault(require("../model/historyModels"));
const cacheManager_1 = require("./cacheManager");
class HistoryService {
    constructor() {
        this.cache = new cacheManager_1.CacheManager((0, redis_1.getRedisClient)());
    }
    async create(data) {
        const history = await historyModels_1.default.create(data);
        if (this.cache !== null) {
            await this.cache.incr("history:version");
        }
        return history;
    }
    async getAll(page = 1, limit = 10, search = "") {
        let cacheKey = "";
        if (cacheKey && this.cache !== null) {
            const cacheVersion = (await this.cache.get("history:version")) || "0";
            if (cacheVersion)
                cacheKey = `history:v${cacheVersion}:p${page}:l${limit}:s${search}`;
            const cached = await this.cache.get(cacheKey);
            if (cached)
                return cached;
        }
        const query = search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ],
            }
            : {};
        const history = await historyModels_1.default.find({ query }).sort({ createdAt: -1 });
        if (cacheKey && this.cache !== null) {
            await this.cache.set(cacheKey, history, 300);
        }
        return history;
    }
}
const historyService = new HistoryService();
exports.default = historyService;
//# sourceMappingURL=history.js.map