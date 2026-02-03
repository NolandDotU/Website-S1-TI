import { IchangePassword, IUser } from "./user.dto";
import UserModel from "../../../model/userModel";
import { ApiError, comparePassword, JWTPayload, logger } from "../../../utils";
import historyService from "../../../utils/history";
import { CacheManager } from "../../../utils";
import { getRedisClient } from "../../../config/redis";
import mongoose from "mongoose";
import { deleteImage } from "../../../middleware/uploads.middleware";
import { compare } from "bcrypt";

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
      logger.info("created user ", user);
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
    logger.info(`Updating user with id: ${id}`);
    try {
      const _id = new mongoose.Types.ObjectId(id);
      const update = await this.model.findByIdAndUpdate(_id, data);
      if (data.photo) {
        deleteImage(data.photo || "").catch((err) => {
          logger.error(
            `Error deleting announcement image: ${data.photo} [ ${err}] `,
          );
          return ApiError.internal(`Failed delete announcement image! ${err}`);
        });
      }
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

  updatePassword = async (data: IchangePassword, currentUser: JWTPayload) => {
    if (currentUser.authProvider !== "local") {
      throw ApiError.forbidden("Password change not allowed");
    }

    const user = await this.model
      .findById(currentUser.id)
      .select("password")
      .exec();

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    logger.info(`compare password: ${data.currentPassword}, ${user.password}`);
    const isMatch = await comparePassword(data.currentPassword, user.password);
    logger.info(`isMatch: ${isMatch}`);

    if (!isMatch) {
      throw ApiError.unauthorized("Old password is incorrect");
    }

    user.password = data.newPassword;
    await user.save();

    if (this.cache) {
      this.cache.incr("users:version");
    }

    setImmediate(() => {
      this.history.create({
        action: "PATCH",
        entityId: user.id,
        entity: "user",
        user: new mongoose.Types.ObjectId(currentUser.id),
        description: `User ${currentUser.username} updated password`,
      });
    });

    return { success: true };
  };

  deleteUser = async (id: string, currentUser: JWTPayload) => {
    const deleted = await this.model.findByIdAndDelete(id).lean().exec();
    if (!deleted) throw ApiError.conflict("Gagal menghapus user!");
    if (deleted.photo) {
      deleteImage(deleted.photo || "").catch((err) => {
        logger.error(
          `Error deleting announcement image: ${deleted.photo} [ ${err}] `,
        );
        return ApiError.internal(`Failed delete announcement image! ${err}`);
      });
    }

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
function hashPassword(newPassword: string): string | PromiseLike<string> {
  throw new Error("Function not implemented.");
}
