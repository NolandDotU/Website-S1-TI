"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const cacheManager_1 = require("./utils/cacheManager");
const logger_1 = require("./utils/logger");
const env_1 = require("./config/env");
const PORT = env_1.env.PORT || 5000; //ini PORT nya
const startServer = async () => {
    try {
        await (0, database_1.mongoConnect)(); //ini connect ke mongodb
        await (0, redis_1.connectRedis)(); //ini connect ke redis
        const cacheManager = new cacheManager_1.CacheManager((0, redis_1.getRedisClient)());
        const server = app_1.default.listen(PORT, () => {
            logger_1.logger.info(`🚀 Server running on port ${PORT}`);
            logger_1.logger.info(`📝 Environment: ${env_1.env.NODE_ENV}`);
        });
        // Shutdown the server gracefully
        const gracefulShutdown = async (signal) => {
            logger_1.logger.info(`${signal} received. Closing server gracefully...`);
            server.close(async () => {
                await (0, database_1.disconnectDB)();
                logger_1.logger.info("Server closed");
                process.exit(0);
            });
        };
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    }
    catch (error) {
        logger_1.logger.error("Failed to start server:", error);
        process.exit(1);
    }
};
logger_1.logger.info(`Starting Connection Server`);
startServer();
//# sourceMappingURL=server.js.map