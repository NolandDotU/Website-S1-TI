import NewsModel from "../../../model/newsModel";
import { getRedisClient } from "../../../config/redis";
import { logger, CacheManager, ApiError } from "../../../utils";
import {
  INews,
  INewsDoc,
  INewsInput,
  INewsResponse,
  INewsQueryDTO,
} from "./news,dto";

export class NewsService {
  private model: typeof NewsModel;
  private cache: CacheManager | null;

  constructor(model = NewsModel, cache?: CacheManager | null) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient()) || null;
    this.cache.flush();
  }

  async getAll(page = 1, limit = 10, search = ""): Promise<INewsResponse[]> {
    const skip = (page - 1) * limit;

    const cacheKey = `news:page:${page}:limit:${limit}:search:${search}`;
    logger.info("Cache Key", cacheKey);

    if (this.cache != null) {
      const cached = await this.cache.get<INewsResponse[]>(cacheKey);
      logger.info("Cached News", cached?.length);
      if (cached) return cached;
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
    if (this.cache != null) this.cache.set(cacheKey, data);

    return data;
  }

  async create(data: INewsInput): Promise<INewsResponse> {
    const exist = await this.model.findOne({ title: data.title });
    if (exist) throw ApiError.conflict("News already exists");
    const newsDoc = await this.model.create(data);
    // await this.cache.del("news");
    return newsDoc.toJSON() as unknown as INewsResponse;
  }

  async getById(id: string): Promise<INewsResponse> {
    const newsDoc = await this.model.findById(id);
    if (!newsDoc) throw ApiError.notFound("News not found");
    return newsDoc.toJSON() as unknown as INewsResponse;
  }

  async update(data: INewsInput, id?: string): Promise<INewsResponse> {
    const exist = await this.model.findOne({
      $and: [
        {
          _id: { $ne: id },
          title: data.title,
        },
      ],
    });

    if (exist) throw ApiError.conflict("News already exists");
    const newsDoc = await this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (!newsDoc) throw ApiError.notFound("News not found");
    // await this.cache.del("news");
    return newsDoc.toJSON() as unknown as INewsResponse;
  }

  async NonActivate(id?: string): Promise<Boolean> {
    const newsDoc = await this.model.findOneAndUpdate(
      { _id: id },
      { isActive: false },
      { new: true }
    );
    if (!newsDoc) throw ApiError.notFound("News not found");
    // await this.cache.del("news");
    return true;
  }
}
