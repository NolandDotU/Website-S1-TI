import { log } from "console";
import { getRedisClient } from "../config/redis";
import HistoryModel, { IHistoryInput } from "../model/historyModels";
import { IHistory, IHistoryResponse } from "../model/historyModels";
import { CacheManager } from "./cacheManager";
import { logger } from "./logger";
import { JWTPayload } from "./jwt";

class HistoryService {
  private cache: CacheManager | null;
  private model: typeof HistoryModel;

  constructor(model = HistoryModel) {
    this.model = model;
    this.cache = CacheManager.getInstance();
  }

  async create(data: IHistoryInput) {
    const history = await HistoryModel.create(data);
    if (this.cache !== null) {
      await this.cache.incr("history:version");
      await this.cache.incr(`history:${data.user}:version`);
    }
    return history;
  }

  async getAll(page = 1, limit = 50, search = "", user?: JWTPayload) {
    let cacheKey = "";
    let cacheVersion = "";

    if (this.cache !== null) {
      if (user && user?.role !== "admin") {
        cacheVersion =
          (await this.cache.get<string>(`history:${user.id}:version`)) || "0";
        if (cacheVersion) {
          cacheKey = `history:${user.id}:v${cacheVersion}:p${page}:l${limit}:s${search}`;
        }
      } else {
        cacheVersion = (await this.cache.get<string>("history:version")) || "0";
        if (cacheVersion) {
          cacheKey = `history:v${cacheVersion}:p${page}:l${limit}:s${search}`;
        }
      }

      if (cacheKey) {
        const cached = await this.cache.get<{
          history: IHistoryResponse[];
          meta: {
            total: number;
            page: number;
            limit: number;
            totalPage: number;
          };
        }>(cacheKey);
        if (cached) return cached;
      }
    }

    const userFilter = user ? { user: user.id } : {};
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
          ...userFilter,
        }
      : {
          ...userFilter,
        };

    const [history, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user"),
      this.model.countDocuments(query),
    ]);

    const result = {
      history: history,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };

    if (cacheKey && this.cache !== null) {
      await this.cache.set(cacheKey, result, 300);
    }

    return result;
  }
}

const historyService = new HistoryService();
export default historyService;
