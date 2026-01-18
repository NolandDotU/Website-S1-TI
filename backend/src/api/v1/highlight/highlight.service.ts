import { ApiError, JWTPayload, logger } from "../../../utils";
import { HighlightModel } from "../../../model/highlightModel";
import { CacheManager } from "../../../utils";
import { getRedisClient } from "../../../config/redis";
import { HighlightDTO } from "./highlight.dto";
import AnnouncementModel from "../../../model/AnnouncementModel";
import mongoose, { mongo } from "mongoose";
import { AnnouncementService } from "../announcement/announcement.service";
import { id } from "zod/v4/locales";
import { IHistoryInput } from "../../../model/historyModels";
import historyService from "../../../utils/history";
import { uploadCarouselPhoto } from "../../../middleware/uploads.middleware";

class HighlightService {
  private model: typeof HighlightModel;
  private cache: CacheManager;
  private annService: AnnouncementService;
  private history: typeof historyService | null = historyService || null;

  constructor(
    model = HighlightModel,
    cache?: CacheManager,
    annService?: AnnouncementService
  ) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient());
    this.annService = annService || new AnnouncementService();
  }

  async create(data: HighlightDTO, currentUser: JWTPayload): Promise<any> {
    const count = await this.model.countDocuments();
    if (count > 3) {
      throw ApiError.conflict("Highlight limit exceeded (max 4)");
    }
    let payload;
    if (data.type === "announcement") {
      try {
        logger.info(`Announcement ID:`, data);
        await this.annService.changeStatus(
          data.announcementId,
          "published",
          currentUser
        );
      } catch (error) {
        logger.error(`Error changing announcement status: ${error}`);
        throw ApiError.badRequest("Announcement not found");
      }

      payload = {
        type: "announcement",
        announcementId: new mongoose.Types.ObjectId(data.announcementId),
        order: data.order,
      };
    } else {
      payload = { ...data };
    }

    const highlights = await this.model.create(payload);
    setImmediate(() => {
      const historyData: IHistoryInput = {
        user: new mongoose.Types.ObjectId(currentUser.id),
        action: "POST",
        entity: "highlight",
        entityId: highlights._id,
        description: `Highlight ${
          data.customContent?.title || data.announcementId
        } was created by ${currentUser.username}.`,
      };

      this.history?.create(historyData);
      if (this.cache !== null) this.cache.incr("highlights:version");
    });

    return highlights;
  }

  // async addAnnouncement(announcementId: String): Promise<any> {
  //   const count = await this.model.countDocuments();
  //   if (count > 4) {
  //     throw ApiError.conflict("Highlight limit exceeded (max 4)");
  //   }
  //   const payload: HighlightDTO = {
  //     type: "announcement",
  //     announcementId: new mongoose.Types.ObjectId(announcementId),
  //   };
  // }

  async getAll(): Promise<any> {
    let cacheKey;
    const cacheVersion =
      (await this.cache.get<string>("highlights:version")) || "0";
    cacheKey = `highlights:v${cacheVersion}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const data = await this.model
      .find({})
      .sort({ origin: 1 })
      .populate("announcementId");

    await this.cache.set(cacheKey, data, 300);

    return data;
  }

  async getById(id: string): Promise<any> {
    const cacheKey = `highlights:item:${id}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const highlight = await this.model.findById(id).populate("announcementId");
    if (!highlight) {
      throw ApiError.notFound("Highlight not found");
    }
    await this.cache.set(cacheKey, highlight, 300);

    return highlight;
  }

  async update(
    id: string,
    data: HighlightDTO,
    currentUser: JWTPayload
  ): Promise<any> {
    const highlight = await this.model.findById(id);
    if (!highlight) {
      throw ApiError.notFound("Highlight not found");
    }
    const updated = await this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    const historyData: IHistoryInput = {
      user: new mongoose.Types.ObjectId(currentUser.id),
      action: "DELETE",
      entity: "highlight",
      entityId: highlight._id,
      description: `Highlight was created by ${currentUser.username}.`,
    };
    await this.history?.create(historyData);
    await this.cache.incr("highlights:version");
    await this.cache.del(`highlights:item:${id}`);

    return updated;
  }

  async delete(id: string, currentUser: JWTPayload): Promise<any> {
    const highlight = await this.model.findByIdAndDelete(id);
    if (!highlight) {
      throw ApiError.notFound("Highlight not found");
    }

    const historyData: IHistoryInput = {
      user: new mongoose.Types.ObjectId(currentUser.id),
      action: "DELETE",
      entity: "highlight",
      entityId: highlight._id,
      description: `Highlight was created by ${currentUser.username}.`,
    };
    await this.history?.create(historyData);
    await this.cache.incr("highlights:version");
    await this.cache.del(`highlights:item:${id}`);

    return highlight;
  }

  async deleteAll(): Promise<any> {
    const result = await this.model.deleteMany({});

    await this.cache.incr("highlights:version");

    return result;
  }
}

const highlightService = new HighlightService();
export default highlightService;
