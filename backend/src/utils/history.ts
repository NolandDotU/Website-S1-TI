import { log } from "console";
import { getRedisClient } from "../config/redis";
import HistoryModel, { IHistoryInput } from "../model/historyModels";
import { IHistory, IHistoryResponse } from "../model/historyModels";
import { CacheManager } from "./cacheManager";
import { logger } from "./logger";

class HistoryService {
  private cache: CacheManager | null = new CacheManager(getRedisClient());
  private model: typeof HistoryModel;

  constructor(model = HistoryModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || null;
  }

  async create(data: IHistoryInput) {
    const history = await HistoryModel.create(data);
    if (this.cache !== null) {
      await this.cache.incr("history:version");
      await this.cache.incr(`history:${data.user}:version`);
    }
    return history;
  }

  async getAll(page = 1, limit = 50, search = "") {
    let cacheKey = "";
    if (cacheKey && this.cache !== null) {
      const cacheVersion =
        (await this.cache.get<string>("history:version")) || "0";
      if (cacheVersion)
        cacheKey = `history:v${cacheVersion}:p${page}:l${limit}:s${search}`;
      const cached = await this.cache.get<IHistoryResponse[]>(cacheKey);
      if (cached) return cached;
    }

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [history, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.model.countDocuments(query),
    ]);

    if (cacheKey && this.cache !== null) {
      await this.cache.set(cacheKey, history, 300);
    }
    return {
      history: history,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async getByUser(user: any) {
    let key = "";
    if (this.cache !== null) {
      const cacheVersion =
        (await this.cache.get<string>(`history:${user.id}:version`)) || "0";
      if (cacheVersion) key = `history:${user.id}:v${cacheVersion}`;
      const cached = await this.cache.get<IHistory[]>(key);
      if (cached) return cached;
    }
    const history = await HistoryModel.find({ user: user.id }).sort({
      createdAt: -1,
    });
    if (key && this.cache !== null) {
      await this.cache.set(key, history, 300);
    }
    return history;
  }
}

const historyService = new HistoryService();
export default historyService;
