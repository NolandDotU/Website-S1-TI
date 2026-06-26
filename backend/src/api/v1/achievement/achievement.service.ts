import AchievementModel from "../../../model/AchievmentModel";
import { CacheManager, ApiError, logger } from "../../../utils";
import historyService from "../../../utils/history";
import mongoose from "mongoose";
import { deleteImage } from "../../../middleware/uploads.middleware";
import { IAchievementInput, IAchievementResponse } from "./achievement.dto";

export class AchievementService {
  private model: typeof AchievementModel;
  private cache: CacheManager;
  private history: typeof historyService | null = historyService || null;

  constructor(model = AchievementModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || CacheManager.getInstance();
    this.history = historyService || null;
  }

  async getAll(
    page = 1,
    limit = 20,
    search = "",
  ): Promise<IAchievementResponse> {
    const skip = (page - 1) * limit;
    const cacheVersion =
      (await this.cache.get<number>("achievements:version")) || 0;
    const normalizedSearch = search.trim().toLowerCase();
    const cacheKey = `achievements:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;

    const cached = await this.cache.get<IAchievementResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: normalizedSearch, $options: "i" } },
            { recipient: { $regex: normalizedSearch, $options: "i" } },
          ],
        }
      : {};

    const [docs, totalItems] = await Promise.all([
      this.model
        .find(searchQuery)
        .sort({ achievementDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(searchQuery),
    ]);

    const response: IAchievementResponse = {
      achievements: docs.map((doc) => doc.toJSON()),
      meta: {
        page,
        limit,
        total: totalItems,
        totalPage: Math.ceil(totalItems / limit),
      },
    };

    setImmediate(() => {
      this.cache.set(cacheKey, response, 3600);
    });

    return response;
  }

  async getById(id: string): Promise<IAchievementResponse> {
    const cacheKey = `achievements:item:${id}`;

    if (this.cache) {
      const cached = await this.cache.get<IAchievementResponse>(cacheKey);
      if (cached) return cached;
    }

    const doc = await this.model.findById(id);
    if (!doc) throw ApiError.notFound("Achievement not found");

    const data = doc.toJSON() as unknown as IAchievementResponse;
    setImmediate(() => {
      if (this.cache) this.cache.set(cacheKey, data, 3600);
    });

    return data;
  }

  async create(data: IAchievementInput, createdBy: any): Promise<IAchievementResponse> {
    const doc = await this.model.create(data);

    if (this.cache) {
      await this.cache.incr("achievements:version");
    }

    setImmediate(() => {
      const historyData = {
        user: new mongoose.Types.ObjectId(createdBy.id),
        action: "POST",
        entity: "achievement",
        entityId: doc._id,
        description: `Achievement titled "${doc.title}" was created by ${createdBy.username}.`,
      };
      this.history?.create(historyData).catch((err) => {
        logger.error("Error creating history: ", err);
      });
    });

    return doc.toJSON() as unknown as IAchievementResponse;
  }

  async update(
    data: IAchievementInput,
    id: string,
    createdBy: any,
  ): Promise<IAchievementResponse> {
    const existing = await this.model.findById(id);
    if (!existing) throw ApiError.notFound("Achievement not found");

    const doc = await this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (!doc) throw ApiError.notFound("Achievement not found");

    if (this.cache) {
      await this.cache.incr("achievements:version");
      await this.cache.del(`achievements:item:${id}`);
    }

    setImmediate(() => {
      if (data.image && existing.image && data.image !== existing.image) {
        deleteImage(existing.image).catch((err) =>
          logger.error(`Error deleting image: ${err}`),
        );
      }
      if (data.certificate && existing.certificate && data.certificate !== existing.certificate) {
        deleteImage(existing.certificate).catch((err) =>
          logger.error(`Error deleting certificate: ${err}`),
        );
      }

      const historyData = {
        user: new mongoose.Types.ObjectId(createdBy.id),
        action: "UPDATE",
        entity: "achievement",
        entityId: doc._id,
        description: `Achievement titled "${doc.title}" was updated by ${createdBy.username}.`,
      };
      this.history?.create(historyData).catch((err) => {
        logger.error("Error creating history: ", err);
      });
    });

    return doc.toJSON() as unknown as IAchievementResponse;
  }

  async delete(id: string, createdBy: any): Promise<boolean> {
    const existing = await this.model.findById(id);
    if (!existing) throw ApiError.notFound("Achievement not found");

    await this.model.deleteOne({ _id: id });

    setImmediate(() => {
      if (existing.image) {
        deleteImage(existing.image).catch((err) =>
          logger.error(`Error deleting image: ${err}`),
        );
      }
      if (existing.certificate) {
        deleteImage(existing.certificate).catch((err) =>
          logger.error(`Error deleting certificate: ${err}`),
        );
      }

      const historyData = {
        user: new mongoose.Types.ObjectId(createdBy.id),
        action: "DELETE",
        entity: "achievement",
        entityId: existing._id,
        description: `Achievement titled "${existing.title}" was deleted by ${createdBy.username}.`,
      };
      this.history?.create(historyData).catch((err) => {
        logger.error("Error creating history: ", err);
      });

      if (this.cache) {
        this.cache.incr("achievements:version");
        this.cache.del(`achievements:item:${id}`);
      }
    });

    return true;
  }
}
