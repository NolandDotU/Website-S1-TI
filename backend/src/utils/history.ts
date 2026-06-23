import { log } from "console";
import { getRedisClient } from "../config/redis";
import HistoryModel, { IHistoryInput } from "../model/historyModels";
import { IHistory, IHistoryResponse } from "../model/historyModels";
import { CacheManager } from "./cacheManager";
import { logger } from "./logger";
import { JWTPayload } from "./jwt";
import { FilterQuery } from "mongoose";

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

  async getAll(
    page = 1,
    limit = 50,
    search = "",
    user?: JWTPayload,
    action = "",
    entity = "",
    dateRange = "all",
  ) {
    let cacheKey = "";
    let cacheVersion = "";

    if (this.cache !== null) {
      if (user && user?.role !== "admin") {
        cacheVersion =
          (await this.cache.get<string>(`history:${user.id}:version`)) || "0";
        if (cacheVersion) {
          cacheKey = `history:${user.id}:v${cacheVersion}:p${page}:l${limit}:s${search}:a${action}:e${entity}:d${dateRange}`;
        }
      } else {
        cacheVersion = (await this.cache.get<string>("history:version")) || "0";
        if (cacheVersion) {
          cacheKey = `history:v${cacheVersion}:p${page}:l${limit}:s${search}:a${action}:e${entity}:d${dateRange}`;
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

    const userFilter = user && user.role !== "admin" ? { user: user.id } : {};

    // Build search filter
    const searchFilter = search
      ? {
        $or: [
          { description: { $regex: search, $options: "i" } },
          { entity: { $regex: search, $options: "i" } },
          { action: { $regex: search, $options: "i" } },
        ],
      }
      : {};

    // Build action filter
    const actionFilter = action ? { action: action.toUpperCase() } : {};

    // Build entity filter
    const entityFilter = entity ? { entity: entity.toLowerCase() } : {};

    // Build date range filter
    let dateFilter: Record<string, any> = {};
    if (dateRange && dateRange !== "all") {
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      switch (dateRange) {
        case "today":
          dateFilter = { createdAt: { $gte: today } };
          break;
        case "week":
          dateFilter = { createdAt: { $gte: startOfWeek } };
          break;
        case "month":
          dateFilter = { createdAt: { $gte: startOfMonth } };
          break;
      }
    }

    const query: FilterQuery<IHistory> = {
      ...userFilter,
      ...searchFilter,
      ...actionFilter,
      ...entityFilter,
      ...dateFilter,
    };

    const model = this.model as any;
    const [history, total] = await Promise.all([
      model
        .find(query)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate("user") as Promise<IHistory[]>,
      this.model.countDocuments(query as any),
    ]);

    const result = {
      history: history,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(total / Number(limit)),
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
