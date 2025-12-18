import NewsModel from "../../../model/newsModel";
import { getRedisClient } from "../../../config/redis";
import { logger, CacheManager, ApiError } from "../../../utils";
import {
  INews,
  INewsDoc,
  INewsInput,
  INewsResponse,
  INewsQueryDTO,
} from "./news.dto";

export class NewsService {
  private model: typeof NewsModel;
  private cache: CacheManager | null;

  constructor(model = NewsModel, cache?: CacheManager | null) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient()) || null;
    this.cache?.flush();
  }

  async getAll(page = 1, limit = 10, search = ""): Promise<INewsResponse[]> {
    const skip = (page - 1) * limit;

    let cacheKey = "";
    if (this.cache) {
      try {
        const cacheVersion = (await this.cache.get("news:version")) || "0";
        const normalizedSearch = search.trim().toLowerCase();
        cacheKey = `news:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;
        logger.info("Cache Key", cacheKey);

        const cached = await this.cache.get<INewsResponse[]>(cacheKey);
        if (cached) {
          logger.info("Cache HIT - Returning cached news", cached.length);
          return cached;
        }
        logger.info("Cache MISS - Fetching from database");
      } catch (error) {
        logger.error("Cache error, falling back to database", error);
      }
    }

    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const docs = await this.model
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const data = docs.map((doc) => doc.toJSON() as unknown as INewsResponse);

    if (this.cache && cacheKey) {
      try {
        await this.cache.set(cacheKey, data); // 1 hour TTL
        logger.info("Cached news data", data.length);
      } catch (error) {
        logger.error("Failed to cache data", error);
      }
    }

    return data;
  }

  async create(data: INewsInput): Promise<INewsResponse> {
    const exist = await this.model.findOne({ title: data.title });
    if (exist) throw ApiError.conflict("News already exists");

    if (this.cache) {
      await this.cache.incr("news:version");
    }

    const newsDoc = await this.model.create(data);
    return newsDoc.toJSON() as unknown as INewsResponse;
  }

  async getById(id: string): Promise<INewsResponse> {
    const cacheKey = `news:item:${id}`;

    if (this.cache) {
      try {
        const cached = await this.cache.get<INewsResponse>(cacheKey);
        if (cached) {
          logger.info("Cache HIT - Returning cached news item", id);
          return cached;
        }
      } catch (error) {
        logger.error("Cache error for getById", error);
      }
    }

    const newsDoc = await this.model.findById(id);
    if (!newsDoc) throw ApiError.notFound("News not found");

    const data = newsDoc.toJSON() as unknown as INewsResponse;

    if (this.cache) {
      try {
        await this.cache.set(cacheKey, data);
      } catch (error) {
        logger.error("Failed to cache news item", error);
      }
    }

    return data;
  }

  async update(data: INewsInput, id?: string): Promise<INewsResponse> {
    const exist = await this.model.findOne({
      _id: { $ne: id },
      title: data.title,
    });

    if (exist) throw ApiError.conflict("News already exists");

    const newsDoc = await this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    if (!newsDoc) throw ApiError.notFound("News not found");

    if (this.cache) {
      try {
        await this.cache.incr("news:version");
        await this.cache.del(`news:item:${id}`);
        logger.info("Cache invalidated after update", id);
      } catch (error) {
        logger.error("Failed to invalidate cache", error);
      }
    }

    return newsDoc.toJSON() as unknown as INewsResponse;
  }

  async deactivate(id?: string): Promise<boolean> {
    const newsDoc = await this.model.findOneAndUpdate(
      { _id: id },
      { isActive: false },
      { new: true }
    );

    if (!newsDoc) throw ApiError.notFound("News not found");

    if (this.cache) {
      try {
        await this.cache.incr("news:version");
        await this.cache.del(`news:item:${id}`);
        logger.info("Cache invalidated after deactivation", id);
      } catch (error) {
        logger.error("Failed to invalidate cache", error);
      }
    }

    return true;
  }

  async delete(id?: string): Promise<boolean> {
    const newsDoc = await this.model.findOneAndDelete({ _id: id });

    if (!newsDoc) throw ApiError.notFound("News not found");

    if (this.cache) {
      try {
        await this.cache.incr("news:version");
        await this.cache.del(`news:item:${id}`);
        logger.info("Cache invalidated after deletion", id);
      } catch (error) {
        logger.error("Failed to invalidate cache", error);
      }
    }
    logger.info("News deleted successfully");
    return true;
  }
}
