import AnnouncementModel from "../../../model/AnnouncementModel";
import { getRedisClient } from "../../../config/redis";
import { logger, CacheManager, ApiError, JWTPayload } from "../../../utils";
import {
  IAnnouncementGet,
  IAnnouncementInput,
  IAnnouncementResponse,
} from "./announcement.dto";
import historyService from "../../../utils/history";
import { IHistoryInput } from "../../../model/historyModels";
import mongoose, { mongo } from "mongoose";
import { deleteImage } from "../../../middleware/uploads.middleware";
import EmbeddingInsertService from "../embeddings/embeddingInsert.service";
export class AnnouncementService {
  private model: typeof AnnouncementModel;
  private cache: CacheManager;
  private history: typeof historyService | null = historyService || null;

  private embedding = EmbeddingInsertService;

  constructor(model = AnnouncementModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || CacheManager.getInstance();
    this.history = historyService || null;
  }

  async getAllPublished(
    page = 1,
    limit = 20,
    search = "",
  ): Promise<IAnnouncementResponse> {
    const skip = (page - 1) * limit;

    const cacheVersion = (await this.cache.get<number>("news:version")) || 0;
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
            { title: { $regex: normalizedSearch, $options: "i" } },
            { content: { $regex: normalizedSearch, $options: "i" } },
            { category: normalizedSearch },
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
        (doc) => doc.toJSON() as unknown as IAnnouncementGet,
      ),
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

  async getAll(
    page = 1,
    limit = 10,
    search = "",
  ): Promise<IAnnouncementResponse> {
    const skip = (page - 1) * limit;

    const cacheVersion = (await this.cache.get<number>("news:version")) || 0;
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
        (doc) => doc.toJSON() as unknown as IAnnouncementGet,
      ),
      meta: {
        page,
        limit,
        total: totalItems,
        totalPage: Math.ceil(totalItems / limit),
      },
    };

    setImmediate(() => {
      if (this.cache !== null && this.cache !== undefined)
        this.cache.set(cacheKey, response, 3600);
    });

    return response;
  }

  async getById(id: string): Promise<IAnnouncementResponse> {
    const cacheKey = `news:item:${id}`;

    if (this.cache !== null && this.cache !== undefined) {
      const cached = await this.cache.get<IAnnouncementResponse>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const newsDoc = await this.model.findById(id);
    if (!newsDoc) throw ApiError.notFound("News not found");

    const data = newsDoc.toJSON() as unknown as IAnnouncementResponse;
    setImmediate(() => {
      if (this.cache !== null && this.cache !== undefined)
        this.cache.set(cacheKey, data, 3600);
    });

    return data;
  }

  async create(
    data: IAnnouncementInput,
    createdBy: any,
  ): Promise<IAnnouncementResponse> {
    const exist = await this.model.findOne({ title: data.title });
    if (exist) throw ApiError.conflict("News already exists");
    if (data.scheduleDate && data.scheduleDate !== null)
      data.status = "scheduled";

    const newsDoc = await this.model.create(data);

    setImmediate(() => {
      const historyData: IHistoryInput = {
        user: new mongoose.Types.ObjectId(createdBy.id),
        action: "POST",
        entity: "announcement",
        entityId: newsDoc._id,
        description: `Announcement titled "${newsDoc.title}" was created by ${createdBy.username}.`,
      };

      this.history?.create(historyData).catch((err) => {
        logger.error("Error creating history: ", err);
      });
      this.cache.incr("news:version");
      this.cache.del(`news:item:${newsDoc.id}`);

      if (newsDoc.status === "published") {
        this.embedding
          .upsertOne(
            "announcement",
            newsDoc._id.toString(),
            `${newsDoc.title}\n${newsDoc.category}\n${newsDoc.content}`,
          )
          .catch((err) =>
            logger.error(
              "Embedding Failed",
              newsDoc._id.toString(),
              err.message,
            ),
          );
      }
    });

    return newsDoc.toJSON() as unknown as IAnnouncementResponse;
  }

  async update(
    data: IAnnouncementInput,
    id?: string,
    createdBy?: any,
  ): Promise<IAnnouncementResponse> {
    const announ = await this.model.findById(id);
    if (announ?.title !== data.title) {
      const exist = await this.model.findOne({ title: data.title });
      if (exist) throw ApiError.conflict("News already exists");
    }

    const newsDoc = await this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (!newsDoc) throw ApiError.notFound("News not found");

    setImmediate(() => {
      if (data.photo !== announ?.photo) {
        logger.info("DELETING IMAGE..", announ?.photo);
        deleteImage(announ?.photo || "").catch((err) => {
          logger.error(
            `Error deleting announcement image: ${announ?.photo} [ ${err}] `,
          );
          return ApiError.internal(`Failed delete announcement image! ${err}`);
        });
      }
      const historyData: IHistoryInput = {
        user: new mongoose.Types.ObjectId(createdBy),
        action: "UPDATE",
        entity: "announcement",
        entityId: newsDoc._id,
        description: `Announcement titled "${newsDoc.title}" was updated by ${createdBy.username}.`,
      };

      this.history?.create(historyData).catch((err) => {
        logger.error("Error creating history: ", err);
      });
      if (this.cache !== null && this.cache) {
        this.cache.incr("news:version");
        this.cache.incr("highlights:version");
        this.cache.incr("history:version");
        this.cache.del(`news:item:${id}`);
      }

      this.embedding
        .upsertOne(
          "announcement",
          newsDoc._id.toString(),
          `${newsDoc.title}\n${newsDoc.category}\n${newsDoc.content}`,
        )
        .catch((err) =>
          logger.error(
            "Embedding Update Failed",
            newsDoc._id.toString(),
            err.message,
          ),
        );
    });

    return newsDoc.toJSON() as unknown as IAnnouncementResponse;
  }

  async changeStatus(
    id?: string,
    status?: string,
    createdBy?: any,
  ): Promise<boolean> {
    let newsDoc;
    if (status === "published") {
      const publishDate = new Date();
      logger.info(`REQUEST ID : ${id}`);
      newsDoc = await this.model.findOneAndUpdate(
        { _id: id },
        { status: status, publishDate: publishDate },
        { new: true },
      );
    }
    if (status === "archived") {
      newsDoc = await this.model.findOneAndUpdate(
        { _id: id },
        { status: status },
        { new: true },
      );
    }
    if (!newsDoc) throw ApiError.notFound("News not found");
    logger.info(`REQUEST ID : ${id} updated to ${status}`);

    setImmediate(() => {
      const historyData: IHistoryInput = {
        user: new mongoose.Types.ObjectId(createdBy),
        action: "PATCH",
        entity: "announcement",
        entityId: newsDoc._id,
        entityModel: this.model.modelName,
        description: `Announcement titled "${newsDoc.title}" status changed to "${status}" by ${createdBy.username}.`,
      };

      this.history?.create(historyData).catch((err) => {
        logger.error(`Error creating history: ${err}`);
      });
      if (this.cache !== null && this.cache) {
        this.cache.incr("news:version");
        this.cache.incr("highlights:version");
        this.cache.incr("history:version");
        this.cache.del(`news:item:${id}`);
      }
    });

    return true;
  }

  async publishMany() {
    const updated = await this.model.updateMany(
      { status: "scheduled" },
      { status: "published" },
    );

    return updated.modifiedCount;
  }

  async delete(id: string, createdBy?: any): Promise<boolean> {
    const newsDoc = await this.model.findOne({ _id: id });
    if (!newsDoc) throw ApiError.notFound("News not found");

    await this.model.deleteOne({ _id: id }).catch((err) => {
      throw ApiError.internal("Failed to delete announcement");
    });

    setImmediate(() => {
      if (newsDoc.photo) {
        deleteImage(newsDoc.photo || "").catch((err) => {
          logger.error("Error deleting announcement image: ", err);
        });
      }

      this.embedding
        .deleteOne("announcement", id)
        .catch((err) =>
          logger.error("Error deleting embedding: ", id, err.message),
        );

      const historyData: IHistoryInput = {
        user: new mongoose.Types.ObjectId(createdBy.id),
        action: "DELETE",
        entity: "announcement",
        entityId: newsDoc._id,
        description: `Announcement titled "${newsDoc.title}" was deleted by ${createdBy.username}.`,
      };
      this.history?.create(historyData).catch((err) => {
        logger.error("Error creating history: ", err);
      });
      if (this.cache !== null && this.cache) {
        this.cache.incr("news:version");
        this.cache.incr("highlights:version");
        this.cache.incr("history:version");
        this.cache.del(`news:item:${id}`);
      }
    });

    return true;
  }

  topTierAnnouncements = async (): Promise<IAnnouncementResponse> => {
    let cacheKey = "";
    if (this.cache !== null && this.cache) {
      cacheKey = `topTierAnnouncements:version`;
      const cached = await this.cache.get<IAnnouncementResponse>(cacheKey);
      if (cached) return cached;
    }

    const cursor = await this.model.find().sort({ views: -1 }).limit(4);
    const data = {
      announcements: cursor,
      meta: {
        total: cursor.length,
        page: 1,
        limit: 5,
      },
    } as IAnnouncementResponse;
    if (this.cache !== null && this.cache) {
      await this.cache.set(cacheKey, data, 3600);
    }
    return data;
  };

  increamentViews = async (id: String, currnetUser: JWTPayload | null) => {
    setImmediate(async () => {
      const newsDoc = await this.model
        .findByIdAndUpdate({ _id: id }, { $inc: { views: 1 } })
        .catch((err) => {
          logger.error("Error updating announcement views: ", err);
        });

      const historyData: IHistoryInput = {
        action: "VIEW",
        entity: "announcement",
        entityId: newsDoc?._id,
        user: new mongoose.Types.ObjectId(currnetUser?.id) || "Guest",
        entityModel: this.model.modelName,
        description: `Announcement titled "${newsDoc?.title}" was viewed by ${currnetUser?.username || "Guest"}.`,
      };

      this.history?.create(historyData).catch((err) => {
        logger.error("Error creating history: ", err);
      });

      if (this.cache !== null && this.cache) {
        this.cache.incr("news:version");
        this.cache.incr("highlights:version");
        this.cache.incr("history:version");
        this.cache.del(`news:item:${id}`);
      }
    });
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
          totalAnnouncement: [{ $count: "count" }],
          totalDraftAnnouncement: [
            {
              $match: {
                status: "draft",
              },
            },
            { $count: "count" },
          ],

          totalPublishedAnnouncement: [
            {
              $match: {
                status: "published",
              },
            },
            { $count: "count" },
          ],

          currentMonthAnnouncement: [
            {
              $match: {
                status: "published",
                publishDate: {
                  $gte: startOfMonth,
                  $lte: endOfMonth,
                },
              },
            },
            { $count: "count" },
          ],

          lastMonthAnnouncement: [
            {
              $match: {
                status: "published",
                publishDate: {
                  $gte: startOfLastMonth,
                  $lte: endOfLastMonth,
                },
              },
            },
            { $count: "count" },
          ],

          mostViewedThisMonth: [
            {
              $match: {
                status: "published",
                publishDate: {
                  $gte: startOfMonth,
                  $lte: endOfMonth,
                },
              },
            },
            { $sort: { views: -1 } },
            { $limit: 1 },
            { $project: { title: 1, views: 1, publishDate: 1 } },
          ],
        },
      },
      {
        $project: {
          totalAnnouncement: {
            $ifNull: [{ $arrayElemAt: ["$totalAnnouncement.count", 0] }, 0],
          },
          totalDraftAnnouncement: {
            $ifNull: [
              { $arrayElemAt: ["$totalDraftAnnouncement.count", 0] },
              0,
            ],
          },
          totalPublishedAnnouncement: {
            $ifNull: [
              { $arrayElemAt: ["$totalPublishedAnnouncement.count", 0] },
              0,
            ],
          },
          currentMonthAnnouncement: {
            $ifNull: [
              { $arrayElemAt: ["$currentMonthAnnouncement.count", 0] },
              0,
            ],
          },
          lastMonthAnnouncement: {
            $ifNull: [{ $arrayElemAt: ["$lastMonthAnnouncement.count", 0] }, 0],
          },
          mostViewedThisMonth: {
            $ifNull: [{ $arrayElemAt: ["$mostViewedThisMonth", 0] }, null],
          },
        },
      },
    ]);

    const data = result[0] ?? {
      totalAnnouncement: 0,
      totalDraftAnnouncement: 0,
      totalPublishedAnnouncement: 0,
      currentMonthAnnouncement: 0,
      lastMonthAnnouncement: 0,
      mostViewedThisMonth: null,
    };

    return data;
  };
}
