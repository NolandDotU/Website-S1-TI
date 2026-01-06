import { createClient, RedisClientType } from "redis";
import { env } from "./env";
import { logger } from "../utils/logger";

let redisClient: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType | null> => {
  try {
    logger.info("Connecting to Redis...");

    redisClient = createClient({
      url: env.REDIS_URL,
      password: env.REDIS_PASSWORD,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error("Redis reconnection failed after 10 attempts");
            return new Error("Max retries reached");
          }
          const delay = Math.min(retries * 100, 3000);
          logger.info(
            `Reconnecting to Redis in ${delay}ms (attempt ${retries})`
          );
          return delay;
        },
      },
    });

    redisClient.on("connect", () => {
      logger.info("Redis connected and ready");
    });

    redisClient.on("error", (err) => {
      logger.error("Redis error:", err.message);
    });

    redisClient.on("reconnecting", () => {
      logger.info("Redis reconnecting...");
    });

    await redisClient.connect();
    logger.info("Redis connected and ready");

    return redisClient;
  } catch (error) {
    logger.warn("Redis unavailable, continuing without cache");
    redisClient = null;
    return null;
  }
};

export const getRedisClient = (): RedisClientType | null => {
  console.log("Redis client:", redisClient);
  return redisClient;
};

export const isRedisReady = (): boolean => {
  return redisClient?.isReady ?? false;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info("Disconnected from Redis");
  }
};
