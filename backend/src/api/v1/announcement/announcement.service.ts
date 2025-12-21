import AnnouncementModel from "../../../model/AnnouncementModel";
import { getRedisClient } from "../../../config/redis";
import { logger, CacheManager, ApiError } from "../../../utils";
import { IAnnouncementInput, IAnnouncementResponse } from "./announcement.dto";
import historyService from "../../../utils/history";
export class AnnouncementService {
  private model: typeof AnnouncementModel;
  private cache: CacheManager;

  constructor(model = AnnouncementModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient());
  }

  async getAllPublished(
    page = 1,
    limit = 20,
    search = ""
  ): Promise<IAnnouncementResponse[]> {
    const skip = (page - 1) * limit;

    const cacheVersion = (await this.cache.get<string>("news:version")) || "0";
    const normalizedSearch = search.trim().toLowerCase();
    const cacheKey = `news:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;

    const cached = await this.cache.get<IAnnouncementResponse[]>(cacheKey);
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
      : {};

    const docs = await this.model
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const data = docs.map(
      (doc) => doc.toJSON() as unknown as IAnnouncementResponse
    );

    await this.cache.set(cacheKey, data, 3600);

    return data;
  }

  async getAll(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<IAnnouncementResponse[]> {
    const skip = (page - 1) * limit;

    const cacheVersion = (await this.cache.get<string>("news:version")) || "0";
    const normalizedSearch = search.trim().toLowerCase();
    const cacheKey = `news:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;

    const cached = await this.cache.get<IAnnouncementResponse[]>(cacheKey);
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
      : {};

    const docs = await this.model
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const data = docs.map(
      (doc) => doc.toJSON() as unknown as IAnnouncementResponse
    );

    await this.cache.set(cacheKey, data, 3600);

    return data;
  }

  async getById(id: string): Promise<IAnnouncementResponse> {
    const cacheKey = `news:item:${id}`;

    const cached = await this.cache.get<IAnnouncementResponse>(cacheKey);
    if (cached) {
      logger.info(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const newsDoc = await this.model.findById(id);
    if (!newsDoc) throw ApiError.notFound("News not found");

    const data = newsDoc.toJSON() as unknown as IAnnouncementResponse;

    await this.cache.set(cacheKey, data, 3600);

    return data;
  }

  async create(data: IAnnouncementInput): Promise<IAnnouncementResponse> {
    const exist = await this.model.findOne({ title: data.title });
    if (exist) throw ApiError.conflict("News already exists");
    if (data.scheduleDate || data.scheduleDate !== null)
      data.status = "scheduled";

    const newsDoc = await this.model.create(data);

    await this.cache.incr("news:version");
    // await historyService.create({
    //   user:
    //   action: "create",
    //   entity: "announcement",
    //   entityId: newsDoc._id,
    //   description: `Announcement titled "${newsDoc.title}" was created.`,
    // });

    return newsDoc.toJSON() as unknown as IAnnouncementResponse;
  }

  async update(
    data: IAnnouncementInput,
    id?: string
  ): Promise<IAnnouncementResponse> {
    const exist = await this.model.findOne({
      _id: { $ne: id },
      title: data.title,
    });
    if (exist) throw ApiError.conflict("News already exists");

    const newsDoc = await this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (!newsDoc) throw ApiError.notFound("News not found");

    await this.cache.incr("news:version");
    await this.cache.del(`news:item:${id}`);

    return newsDoc.toJSON() as unknown as IAnnouncementResponse;
  }

  async changeStatus(id?: string, status?: string): Promise<boolean> {
    const newsDoc = await this.model.findOneAndUpdate(
      { _id: id },
      { status: "published" },
      { new: true }
    );
    if (!newsDoc) throw ApiError.notFound("News not found");

    await this.cache.incr("news:version");
    await this.cache.del(`news:item:${id}`);

    return true;
  }

  async delete(id?: string): Promise<boolean> {
    const newsDoc = await this.model.findOneAndDelete({ _id: id });
    if (!newsDoc) throw ApiError.notFound("News not found");

    await this.cache.incr("news:version");
    await this.cache.del(`news:item:${id}`);

    return true;
  }
}
