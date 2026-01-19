import { IUser } from "./user.dto";
import UserModel from "../../../model/userModel";
import { ApiError, JWTPayload, logger } from "../../../utils";
import historyService from "../../../utils/history";
import { CacheManager } from "../../../utils";
import { getRedisClient } from "../../../config/redis";
import mongoose from "mongoose";

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
    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
          limit: limit,
          skip: (page - 1) * limit,
        }
      : {};
    const [users, total] = await Promise.all([
      this.model.find(query).sort({ username: 1 }).lean().exec(),
      this.model.countDocuments(query).lean().exec(),
    ]);
    setImmediate(() => {
      if (this.cache !== null) this.cache.set(cacheKey, users, 1 * 60 * 30);
    });
    return {
      users: users,
      meta: {
        page: page,
        limit: limit,
        total: total,
        totalPage: Math.ceil(total / limit),
      },
    };
  };

  newUser = async (data: IUser, curentUser: JWTPayload) => {
    try {
      const user = await this.model.create(data);
      if (!user) throw ApiError.conflict("Gagal membuat user baru!");
      if (this.cache !== null) this.cache.incr("users:version");
      setImmediate(() => {
        this.history.create({
          action: "POST",
          entityId: new mongoose.Types.ObjectId(user.id),
          entity: "user",
          user: new mongoose.Types.ObjectId(curentUser.id),
          description: `User ${data.username} created by ${curentUser.username}`,
        });
      });
      return user;
    } catch (error: any) {
      if (error.code === 11000)
        throw ApiError.conflict("Username atau email sudah digunakan!");
      throw error;
    }
  };

  updateUser = async (id: string, data: IUser, currentUser: JWTPayload) => {
    try {
      const _id = new mongoose.Types.ObjectId(id);
      const update = await this.model.findByIdAndUpdate(_id, data);
      if (!update) throw ApiError.conflict("Gagal mengupdate user!");
      if (this.cache !== null) this.cache.incr("users:version");
      setImmediate(() => {
        this.history.create({
          action: "UPDATE",
          entityId: new mongoose.Types.ObjectId(data.id),
          entity: "user",
          user: new mongoose.Types.ObjectId(currentUser.id),
          description: `User ${data.username} updated by ${currentUser.username}`,
        });
      });
      return update;
    } catch (error: any) {
      if (error.code === 11000)
        throw ApiError.conflict("Username atau email sudah digunakan!");
      throw error;
    }
  };

  deleteUser = async (id: string, currentUser: JWTPayload) => {
    const deleted = await this.model.findByIdAndDelete(id).lean().exec();
    if (!deleted) throw ApiError.conflict("Gagal menghapus user!");
    setImmediate(() => {
      if (this.cache !== null) this.cache.incr("users:version");
      this.history.create({
        action: "DELETE",
        entityId: new mongoose.Types.ObjectId(id),
        entity: "user",
        user: new mongoose.Types.ObjectId(currentUser.id),
        description: `User ${deleted.username} deleted by ${currentUser.username}`,
      });
    });
    return deleted;
  };

  changeStatus = async (
    id: string,
    isActive: boolean,
    currentUser: JWTPayload,
  ) => {
    const update = await this.model
      .findOneAndUpdate({ _id: id }, { isActive: isActive }, { new: true })
      .lean()
      .exec();

    if (!update) throw ApiError.conflict("Gagal mengubah status user!");
    setImmediate(() => {
      if (this.cache !== null) this.cache.incr("users:version");
      this.history.create({
        action: "UPDATE",
        entityId: new mongoose.Types.ObjectId(id),
        entity: "user",
        user: new mongoose.Types.ObjectId(currentUser.id),
        description: `User ${update.username} updated by ${currentUser.username}`,
      });
    });
    return update;
  };

  getStatistics = async (
    startOfMonth: Date,
    endOfMonth: Date,
    startOfLastMonth: Date,
    endOfLastMonth: Date,
  ) => {
    const result = await this.model.aggregate([
      {
        $facet: {
          totalUser: [{ $count: "count" }],

          currentMonthActiveUser: [
            {
              $match: {
                isActive: true,
                lastLogin: {
                  // $gte: startOfMonth,
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
                lastLogin: {
                  // $gte: startOfLastMonth,
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
    logger.info(`USER STATISTICS DATA :`, data);
    return {
      totalUser: data.totalUser[0]?.count ?? 0,
      currentMonthActiveUser: data.currentMonthActiveUser[0]?.count ?? 0,
      lastMonthActiveUser: data.lastMonthActiveUser[0]?.count ?? 0,
    };
  };
}
