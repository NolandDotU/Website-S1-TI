"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRedis = exports.isRedisReady = exports.getRedisClient = exports.connectRedis = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
let redisClient = null;
const connectRedis = async () => {
    try {
        logger_1.logger.info("Connecting to Redis...");
        redisClient = (0, redis_1.createClient)({
            url: env_1.env.REDIS_URL,
            password: env_1.env.REDIS_PASSWORD,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        logger_1.logger.error("Redis reconnection failed after 10 attempts");
                        return new Error("Max retries reached");
                    }
                    const delay = Math.min(retries * 100, 3000);
                    logger_1.logger.info(`Reconnecting to Redis in ${delay}ms (attempt ${retries})`);
                    return delay;
                },
            },
        });
        redisClient.on("error", (err) => {
            logger_1.logger.error("Redis error:", err.message);
        });
        redisClient.on("reconnecting", () => {
            logger_1.logger.info("Redis reconnecting...");
        });
        await redisClient.connect();
        logger_1.logger.info("Redis connected and ready");
        return redisClient;
    }
    catch (error) {
        logger_1.logger.warn("Redis unavailable, continuing without cache");
        redisClient = null;
        return null;
    }
};
exports.connectRedis = connectRedis;
const getRedisClient = () => {
    return redisClient;
};
exports.getRedisClient = getRedisClient;
const isRedisReady = () => {
    return redisClient?.isReady ?? false;
};
exports.isRedisReady = isRedisReady;
const disconnectRedis = async () => {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        logger_1.logger.info("Disconnected from Redis");
    }
};
exports.disconnectRedis = disconnectRedis;
//# sourceMappingURL=redis.js.map