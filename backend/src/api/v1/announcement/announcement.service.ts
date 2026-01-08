import AnnouncementModel from "../../../model/AnnouncementModel";
import { getRedisClient } from "../../../config/redis";
import { logger, CacheManager, ApiError } from "../../../utils";
import {
  IAnnouncementGet,
  IAnnouncementInput,
  IAnnouncementResponse,
} from "./announcement.dto";
import historyService from "../../../utils/history";
import { IHistoryInput } from "../../../model/historyModels";
import mongoose, { mongo } from "mongoose";
import { deleteImage } from "../../../middleware/uploads.middleware";
export class AnnouncementService {
  private model: typeof AnnouncementModel;
  private cache: CacheManager;
  private history: typeof historyService | null = historyService || null;

  constructor(model = AnnouncementModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient());
    this.history = historyService || null;
  }

  async getAllPublished(
    page = 1,
    limit = 20,
    search = ""
  ): Promise<IAnnouncementResponse> {
    const skip = (page - 1) * limit;

    const cacheVersion = (await this.cache.get<string>("news:version")) || "0";
    const normalizedSearch = search.trim().toLowerCase();
    const cacheKey = `news:published:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;

    const cached = await this.cache.get<IAnnouncementResponse>(cacheKey);
    if (cached) {
      logger.info(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
          status: "published",
        }
      : { status: "published" };

    const [docs, totalItems] = await Promise.all([
      this.model
        .find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(searchQuery),
    ]);

    const response: IAnnouncementResponse = {
      announcements: docs.map(
        (doc) => doc.toJSON() as unknown as IAnnouncementGet
      ),
      meta: {
        page,
        limit,
        total: totalItems,
        totalPage: Math.ceil(totalItems / limit),
      },
    };

    await this.cache.set(cacheKey, response, 3600);

    return response;
  }

  async getAll(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<IAnnouncementResponse> {
    const skip = (page - 1) * limit;

    const cacheVersion = (await this.cache.get<string>("news:version")) || "0";
    const normalizedSearch = search.trim().toLowerCase();
    const cacheKey = `news:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;

    const cached = await this.cache.get<IAnnouncementResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [docs, totalItems] = await Promise.all([
      this.model
        .find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(searchQuery),
    ]);

    const response: IAnnouncementResponse = {
      announcements: docs.map(
        (doc) => doc.toJSON() as unknown as IAnnouncementGet
      ),
      meta: {
        page,
        limit,
        total: totalItems,
        totalPage: Math.ceil(totalItems / limit),
      },
    };

    await this.cache.set(cacheKey, response, 3600);

    return response;
  }

  async getById(id: string): Promise<IAnnouncementResponse> {
    const cacheKey = `news:item:${id}`;

    const cached = await this.cache.get<IAnnouncementResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const newsDoc = await this.model.findById(id);
    if (!newsDoc) throw ApiError.notFound("News not found");

    const data = newsDoc.toJSON() as unknown as IAnnouncementResponse;

    await this.cache.set(cacheKey, data, 3600);

    return data;
  }

  async create(
    data: IAnnouncementInput,
    createdBy: any
  ): Promise<IAnnouncementResponse> {
    const exist = await this.model.findOne({ title: data.title });
    if (exist) throw ApiError.conflict("News already exists");
    if (data.scheduleDate && data.scheduleDate !== null)
      data.status = "scheduled";

    const newsDoc = await this.model.create(data);

    await this.cache.incr("news:version");
    await this.cache.del(`news:item:${newsDoc.id}`);

    const historyData: IHistoryInput = {
      user: new mongoose.Types.ObjectId(createdBy.id),
      action: "POST",
      entity: "announcement",
      entityId: newsDoc._id,
      description: `Announcement titled "${newsDoc.title}" was created by ${createdBy.username}.`,
    };

    await this.history?.create(historyData);

    return newsDoc.toJSON() as unknown as IAnnouncementResponse;
  }

  async update(
    data: IAnnouncementInput,
    id?: string,
    createdBy?: any
  ): Promise<IAnnouncementResponse> {
    const [exist, announ] = await Promise.all([
      this.model.findOne({
        _id: { $ne: id },
        title: data.title,
      }),
      this.model.findById({
        _id: id,
      }),
    ]);
    if (exist) throw ApiError.conflict("News already exists");
    if (data.photo !== announ?.photo) {
      deleteImage(announ?.photo || "").catch((err) => {
        logger.error(
          `Error deleting announcement image: ${announ?.photo} [ ${err}] `
        );
        return ApiError.internal(`Failed delete announcement image! ${err}`);
      });
    }

    const newsDoc = await this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (!newsDoc) throw ApiError.notFound("News not found");

    const historyData: IHistoryInput = {
      user: new mongoose.Types.ObjectId(createdBy),
      action: "UPDATE",
      entity: "announcement",
      entityId: newsDoc._id,
      description: `Announcement titled "${newsDoc.title}" was updated by ${createdBy.username}.`,
    };

    await this.history?.create(historyData);

    await this.cache.incr("news:version");
    await this.cache.incr("highlights:version");
    await this.cache.incr("history:version");
    await this.cache.del(`news:item:${id}`);

    return newsDoc.toJSON() as unknown as IAnnouncementResponse;
  }

  async changeStatus(
    id?: string,
    status?: string,
    createdBy?: any
  ): Promise<boolean> {
    let newsDoc;
    if (status === "published") {
      const publishDate = new Date();
      logger.info(`REQUEST ID : ${id}`);
      newsDoc = await this.model.findOneAndUpdate(
        { _id: id },
        { status: status, publishDate: publishDate },
        { new: true }
      );
    }
    if (status === "archived") {
      newsDoc = await this.model.findOneAndUpdate(
        { _id: id },
        { status: status },
        { new: true }
      );
    }
    if (!newsDoc) throw ApiError.notFound("News not found");
    logger.info(`REQUEST ID : ${id} updated to ${status}`);

    const historyData: IHistoryInput = {
      user: new mongoose.Types.ObjectId(createdBy),
      action: "PATCH",
      entity: "announcement",
      entityId: newsDoc._id,
      entityModel: this.model.modelName,
      description: `Announcement titled "${newsDoc.title}" status changed to "${status}" by ${createdBy.username}.`,
    };

    await this.history?.create(historyData);
    await this.cache.incr("news:version");
    await this.cache.incr("highlights:version");
    await this.cache.incr("history:version");
    await this.cache.del(`news:item:${id}`);

    return true;
  }

  async publishMany() {
    const updated = await this.model.updateMany(
      { status: "scheduled" },
      { status: "published" }
    );

    return updated.modifiedCount;
  }

  async delete(id?: string, createdBy?: any): Promise<boolean> {
    const newsDoc = await this.model.findOne({ _id: id });
    if (!newsDoc) throw ApiError.notFound("News not found");
    deleteImage(newsDoc.photo || "").catch((err) => {
      logger.error("Error deleting announcement image: ", err);
    });

    await this.model.deleteOne({ _id: id }).catch((err) => {
      throw ApiError.internal("Failed to delete announcement");
    });

    const historyData: IHistoryInput = {
      user: new mongoose.Types.ObjectId(createdBy.id),
      action: "DELETE",
      entity: "announcement",
      entityId: newsDoc._id,
      description: `Announcement titled "${newsDoc.title}" was deleted by ${createdBy.username}.`,
    };
    await this.history?.create(historyData);

    await this.cache.incr("news:version");
    await this.cache.incr("highlights:version");
    await this.cache.incr("history:version");
    await this.cache.del(`news:item:${id}`);

    return true;
  }
}
