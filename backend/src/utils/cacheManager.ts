import { RedisClientType } from "redis";
import { isRedisReady } from "../config/redis";
import { logger } from "./logger";

export class CacheManager {
  private client: RedisClientType | null;

  constructor(client: RedisClientType | null) {
    this.client = client;
  }

  private isAvailable(): boolean {
    return this.client !== null && isRedisReady();
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) return null;

    try {
      const data = await this.client!.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.debug(`Cache get failed for key: ${key}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      const serialized = JSON.stringify(value);
      await this.client!.setEx(key, ttl, serialized);
    } catch (err) {
      logger.debug(`Cache set failed for key: ${key}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await this.client!.del(key);
    } catch (err) {
      logger.debug(`Cache delete failed for key: ${key}`);
    }
  }

  async incr(key: string): Promise<number> {
    if (!this.isAvailable()) return 0;

    try {
      return await this.client!.incr(key);
    } catch (err) {
      logger.debug(`Cache incr failed for key: ${key}`);
      return 0;
    }
  }
}
