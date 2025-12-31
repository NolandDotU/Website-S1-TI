"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const redis_1 = require("../config/redis");
const logger_1 = require("./logger");
class CacheManager {
    constructor(client) {
        this.client = client;
    }
    isAvailable() {
        return this.client !== null && (0, redis_1.isRedisReady)();
    }
    async get(key) {
        if (!this.isAvailable())
            return null;
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch (err) {
            logger_1.logger.debug(`Cache get failed for key: ${key}`);
            return null;
        }
    }
    async set(key, value, ttl = 3600) {
        if (!this.isAvailable())
            return;
        try {
            const serialized = JSON.stringify(value);
            await this.client.setEx(key, ttl, serialized);
        }
        catch (err) {
            logger_1.logger.debug(`Cache set failed for key: ${key}`);
        }
    }
    async del(key) {
        if (!this.isAvailable())
            return;
        try {
            await this.client.del(key);
        }
        catch (err) {
            logger_1.logger.debug(`Cache delete failed for key: ${key}`);
        }
    }
    async incr(key) {
        if (!this.isAvailable())
            return 0;
        try {
            return await this.client.incr(key);
        }
        catch (err) {
            logger_1.logger.debug(`Cache incr failed for key: ${key}`);
            return 0;
        }
    }
}
exports.CacheManager = CacheManager;
//# sourceMappingURL=cacheManager.js.map