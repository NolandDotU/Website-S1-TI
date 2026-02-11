import { RedisClientType } from "redis";
import { getRedisClient, isRedisReady } from "../config/redis";
import { logger } from "./logger";

export class CacheManager {
  private static instance: CacheManager | null = null;

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // private isAvailable(): boolean {
  //   const client = getRedisClient(); // ← Fetch fresh setiap kali
  //   return client !== null && isRedisReady();
  // }

  async get<T>(key: string): Promise<T | null> {
    const client = getRedisClient(); // ← Fetch fresh
    if (!client || !isRedisReady()) return null;

    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.debug(`Cache get failed for key: ${key}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
    const client = getRedisClient(); // ← Fetch fresh
    if (!client || !isRedisReady()) return;

    try {
      const serialized = JSON.stringify(value);
      await client.setEx(key, ttl, serialized);
    } catch (err) {
      logger.debug(`Cache set failed for key: ${key}`);
    }
  }

  async del(key: string): Promise<void> {
    const client = getRedisClient(); // ← Fetch fresh
    if (!client || !isRedisReady()) return;

    try {
      await client.del(key);
    } catch (err) {
      logger.debug(`Cache delete failed for key: ${key}`);
    }
  }

  async incr(key: string): Promise<number> {
    const client = getRedisClient(); // ← Fetch fresh
    if (!client || !isRedisReady()) return 0;

    try {
      const keyExists = await client.exists(key);
      if (!keyExists) {
        await client.set(key, "1");
        return 1;
      }
      return await client.incr(key);
    } catch (err) {
      logger.error(`Cache incr failed for key: ${key}`, err);
      return 0;
    }
  }
}
