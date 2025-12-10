import { createClient, RedisClientType } from "redis";
import { env } from "./env";
import { logger } from "../utils/logger";

let redisClient: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  try {
    redisClient = createClient({
      socket: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        reconnectStrategy: (retries, cause) => {
          if (retries > 10) {
            throw new Error(
              `Could not connect to Redis after ${retries} retries because: ${cause}`
            );
          }
          return Math.min(retries * 100, 3000);
        },
      },
      password: env.REDIS_PASSWORD,
    });

    redisClient.on("error", (err) =>
      logger.error("Redis error: " + err.message)
    );
    redisClient.on("connect", () => logger.info("Connected to Redis."));
    redisClient.on("ready", () => logger.info("Redis ready."));
    redisClient.on("reconnecting", () => logger.info("Reconnecting to Redis."));

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error("Failed to connect to Redis:", error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) throw new Error("Redis client not initialized");
  return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    logger.info("Disconnected from Redis.");
  }
};
