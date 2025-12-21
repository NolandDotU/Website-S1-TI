import { ca } from "zod/v4/locales";
import { getRedisClient } from "../config/redis";
import HistoryModel, { IHistoryInput } from "../model/historyModels";
import { IHistory, IHistoryResponse } from "../model/historyModels";
import { CacheManager } from "./cacheManager";

class HistoryService {
  cache: CacheManager | null = new CacheManager(getRedisClient());
  async create(data: IHistoryInput) {
    const history = await HistoryModel.create(data);
    if (this.cache !== null) {
      await this.cache.incr("history:version");
    }
    return history;
  }

  async getAll(page = 1, limit = 10, search = "") {
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

    const history = await HistoryModel.find({ query }).sort({ createdAt: -1 });

    if (cacheKey && this.cache !== null) {
      await this.cache.set(cacheKey, history, 300);
    }
    return history;
  }
}

const historyService = new HistoryService();
export default historyService;
