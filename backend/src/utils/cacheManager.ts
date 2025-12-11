import { RedisClientType } from "redis";
import { logger } from "./logger";
import { env } from "../config/env";

export class CacheManager {
  private client: RedisClientType;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`Failed to get cache for: ${key}`, error);
      return null;
    }
  }

  async set(key: string, data: any): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      const ttl = env.TTL;

      if (ttl) {
        await this.client.setEx(key, ttl, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      logger.error(`Failed to set cache for: ${key}`, error);
    }
  }

  async del(key: string | string[]): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Failed to delete cache for: ${key}`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const exist = await this.client.exists(key);
      return exist === 1;
    } catch (error) {
      logger.error(`Failed to check exists for: ${key}`, error);
      return false;
    }
  }

  async flush(): Promise<void> {
    try {
      await this.client.flushAll();
    } catch (error) {
      logger.error(`Failed to flush cache`, error);
    }
  }
}
