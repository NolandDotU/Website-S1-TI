import { IUser } from "./user.dto";
import UserModel from "../../../model/userModel";
import { ApiError } from "../../../utils";
import historyService from "../../../utils/history";
import { CacheManager } from "../../../utils";
import { getRedisClient } from "../../../config/redis";

export class UserService {
  private model: typeof UserModel;
  private history = historyService;
  private cache: CacheManager | null = new CacheManager(getRedisClient());
  constructor(model = UserModel) {
    this.model = model;
    this.history = historyService;
    this.cache = new CacheManager(getRedisClient());
  }

  getAllUser = async (page = 1, limit = 10, search = "") => {
    let cacheKey = "";
    if (this.cache !== null && this.cache) {
      const cacheVersion =
        (await this.cache.get<string>("users:version")) || "0";
      if (cacheVersion)
        cacheKey = `users:v${cacheVersion}:p${page}:l${limit}:s${search}`;
      const cached = await this.cache.get<IUser[]>(cacheKey);
      if (cached) return cached;
    }
  };

  getStatistics = async (
    startOfMonth: Date,
    endOfMonth: Date,
    startOfLastMonth: Date,
    endOfLastMonth: Date
  ) => {
    const result = await this.model.aggregate([
      {
        $facet: {
          totalUser: [{ $count: "count" }],

          currentMonthActiveUser: [
            {
              $match: {
                isActive: true,
                publishDate: {
                  $gte: startOfMonth,
                  $lte: endOfMonth,
                },
              },
            },
            { $count: "count" },
          ],

          lastMonthActiveUser: [
            {
              $match: {
                isActive: true,
                publishDate: {
                  $gte: startOfLastMonth,
                  $lte: endOfLastMonth,
                },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = result[0];

    return {
      totalUser: data.totalUser[0]?.count ?? 0,
      currentMonthActiveUser: data.currentMonthActiveUser[0]?.count ?? 0,
      lastMonthActiveUser: data.lastMonthActiveUser[0]?.count ?? 0,
    };
  };
}
