import app from "./app";
import { getDBStatus, disconnectDB, mongoConnect } from "./config/database";
import { connectRedis, getRedisClient } from "./config/redis";
import { CacheManager } from "./utils/cacheManager";
import { logger } from "./utils/logger";
import { env } from "./config/env";

const PORT = env.PORT || 5000; //ini PORT nya

const startServer = async () => {
  try {
    await mongoConnect(); //ini connect ke mongodb
    await connectRedis(); //ini connect ke redis
    const cacheManager = new CacheManager(getRedisClient());
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
    });

    // Shutdown the server gracefully
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Closing server gracefully...`);
      server.close(async () => {
        await disconnectDB();

        logger.info("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

logger.info(`Starting Connection Server`);
startServer();
