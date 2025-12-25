import { ApiError, logger } from "../../../utils";
import { HighlightModel } from "../../../model/highlightModel";
import { CacheManager } from "../../../utils";
import { getRedisClient } from "../../../config/redis";
import { INewsHighlightInput } from "./highlight.dto";

class HighlightService {
  private model: typeof HighlightModel;
  private cache: CacheManager;

  constructor(model = HighlightModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient());
  }

  async create(data: INewsHighlightInput[]): Promise<any> {
    const count = await this.model.countDocuments();
    if (count + data.length > 4) {
      throw ApiError.conflict("Highlight limit exceeded (max 4)");
    }

    const highlights = await this.model.create(data);

    await this.cache.incr("highlights:version");

    return highlights;
  }

  async getAll(): Promise<any> {
    const cacheVersion =
      (await this.cache.get<string>("highlights:version")) || "0";
    const cacheKey = `highlights:v${cacheVersion}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const data = await this.model
      .find({})
      .sort({ createdAt: -1 })
      .populate("contentId");

    await this.cache.set(cacheKey, data, 300);

    return data;
  }

  async getById(id: string): Promise<any> {
    const cacheKey = `highlights:item:${id}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const highlight = await this.model.findById(id).populate("contentId");
    if (!highlight) {
      throw ApiError.notFound("Highlight not found");
    }

    await this.cache.set(cacheKey, highlight, 300);

    return highlight;
  }

  async delete(id: string): Promise<any> {
    const highlight = await this.model.findByIdAndDelete(id);
    if (!highlight) {
      throw ApiError.notFound("Highlight not found");
    }

    await this.cache.incr("highlights:version");
    await this.cache.del(`highlights:item:${id}`);

    return highlight;
  }

  async deleteAll(): Promise<any> {
    const result = await this.model.deleteMany({});

    await this.cache.incr("highlights:version");

    return result;
  }
}

const highlightService = new HighlightService();
export default highlightService;
