import NewsModel from "../../../model/newsModel";
import { getRedisClient } from "../../../config/redis";
import { logger, CacheManager, ApiError } from "../../../utils";
import { INewsInput, INewsResponse } from "./news.dto";

export class NewsService {
  private model: typeof NewsModel;
  private cache: CacheManager;

  constructor(model = NewsModel, cache?: CacheManager) {
    this.model = model;
    // ✅ Selalu instantiate, tapi CacheManager yang handle null client
    this.cache = cache || new CacheManager(getRedisClient());
  }

  async getAll(page = 1, limit = 10, search = ""): Promise<INewsResponse[]> {
    const skip = (page - 1) * limit;

    const cacheVersion = (await this.cache.get<string>("news:version")) || "0";
    const normalizedSearch = search.trim().toLowerCase();
    const cacheKey = `news:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;

    const cached = await this.cache.get<INewsResponse[]>(cacheKey);
    if (cached) {
      logger.info(`Cache HIT: ${cacheKey}`);
      return cached;
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

    await this.cache.set(cacheKey, data, 3600);

    return data;
  }

  async getById(id: string): Promise<INewsResponse> {
    const cacheKey = `news:item:${id}`;

    const cached = await this.cache.get<INewsResponse>(cacheKey);
    if (cached) {
      logger.info(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const newsDoc = await this.model.findById(id);
    if (!newsDoc) throw ApiError.notFound("News not found");

    const data = newsDoc.toJSON() as unknown as INewsResponse;

    await this.cache.set(cacheKey, data, 3600);

    return data;
  }

  async create(data: INewsInput): Promise<INewsResponse> {
    const exist = await this.model.findOne({ title: data.title });
    if (exist) throw ApiError.conflict("News already exists");

    const newsDoc = await this.model.create(data);

    await this.cache.incr("news:version");

    return newsDoc.toJSON() as unknown as INewsResponse;
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

    await this.cache.incr("news:version");
    await this.cache.del(`news:item:${id}`);

    return newsDoc.toJSON() as unknown as INewsResponse;
  }

  async deactivate(id?: string): Promise<boolean> {
    const newsDoc = await this.model.findOneAndUpdate(
      { _id: id },
      { isActive: false },
      { new: true }
    );
    if (!newsDoc) throw ApiError.notFound("News not found");

    await this.cache.incr("news:version");
    await this.cache.del(`news:item:${id}`);

    return true;
  }

  async delete(id?: string): Promise<boolean> {
    const newsDoc = await this.model.findOneAndDelete({ _id: id });
    if (!newsDoc) throw ApiError.notFound("News not found");

    await this.cache.incr("news:version");
    await this.cache.del(`news:item:${id}`);

    return true;
  }
}
