import { IUser } from "./user.dto";
import UserModel from "../../../model/userModel";
import { ApiError } from "../../../utils";
import historyService from "../../../utils/history";
import { CacheManager } from "../../../utils";
import { getRedisClient } from "../../../config/redis";

class UserService {
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
}
