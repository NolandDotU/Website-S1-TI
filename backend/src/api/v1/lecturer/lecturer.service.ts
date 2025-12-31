import { LecturerModel } from "../../../model/lecturerModel";
import {
  ILecturerInput,
  ILecturerResponse,
  IPaginatedLecturerResponse,
} from "./lecturer.dto";
import { CacheManager, logger, ApiError } from "../../../utils/index";
import { getRedisClient } from "../../../config/redis";
import { deleteImage } from "../../../middleware/uploads.middleware";
import { IHistoryInput } from "../../../model/historyModels";
import historyService from "../../../utils/history";
import mongoose from "mongoose";

export class LecturerService {
  private model: typeof LecturerModel;
  private cache: CacheManager;
  private history: typeof historyService;

  constructor(model = LecturerModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient());
    this.history = historyService;
  }

  async create(
    data: ILecturerInput,
    currentUser: any
  ): Promise<ILecturerResponse> {
    const existing = await this.model.findOne({ email: data.email });
    if (existing) {
      throw ApiError.conflict("Lecturer already exists");
    }

    const lecturerDoc = await this.model.create(data);
    const historyData: IHistoryInput = {
      action: "POST",
      entityId: new mongoose.Types.ObjectId(lecturerDoc.id),
      entity: "lecturer",
      user: currentUser?.id ?? null,
      description: `Lecturer ${data.username} created by ${currentUser?.username}`,
    };

    await this.history.create(historyData);

    await this.cache.incr("lecturers:version");

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }

  async getAll(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<IPaginatedLecturerResponse> {
    const skip = (page - 1) * limit;

    const cacheVersion =
      (await this.cache.get<string>("lecturers:version")) || "0";
    const normalizedSearch = search.trim().toLowerCase();
    const cacheKey = `lecturers:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;

    const cached = await this.cache.get<IPaginatedLecturerResponse>(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [docs, totalItems] = await Promise.all([
      this.model
        .find(searchQuery)
        .sort({ username: 1, _id: 1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(searchQuery),
    ]);

    const data = docs.map(
      (doc) => doc.toJSON() as unknown as ILecturerResponse
    );

    const result: IPaginatedLecturerResponse = {
      lecturers: data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };

    await this.cache.set(cacheKey, result, 3600); // 1 hour

    return result;
  }

  async getById(id: string): Promise<ILecturerResponse> {
    const cacheKey = `lecturers:item:${id}`;

    const cached = await this.cache.get<ILecturerResponse>(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const lecturerDoc = await this.model.findById(id);
    if (!lecturerDoc) {
      throw ApiError.notFound("Lecturer not found");
    }

    const data = lecturerDoc.toJSON() as unknown as ILecturerResponse;

    await this.cache.set(cacheKey, data, 3600);

    return data;
  }

  async update(
    data: ILecturerInput,
    id?: string,
    currentUser?: any
  ): Promise<ILecturerResponse> {
    if (!id) {
      throw ApiError.badRequest("Lecturer ID is required");
    }
    const lecturer = await this.model.findOne({
      $or: [{ _id: id }, { email: id }],
    });

    if (!lecturer) {
      throw ApiError.notFound("Lecturer not found");
    }
    if (lecturer.photo) {
      deleteImage(lecturer.photo).catch((err) => {
        logger.error("Error deleting lecturer image: ", err);
      });
    }
    const lecturerDoc = await this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    if (!lecturerDoc) {
      throw ApiError.notFound("Lecturer not found");
    }

    const historyData: IHistoryInput = {
      action: "UPDATE",
      entityId: new mongoose.Types.ObjectId(lecturerDoc.id),
      entity: "lecturer",
      user: currentUser?.id ?? null,
      description: `Lecturer ${data.username} updated by ${currentUser?.username}`,
    };
    await this.history.create(historyData);

    await this.cache.incr("lecturers:version");
    await this.cache.del(`lecturers:item:${id}`);

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }

  async delete(id: string, currentUser?: any): Promise<ILecturerResponse> {
    const lecturerDoc = await this.model.findOne({
      $or: [{ _id: id }, { email: id }],
    });

    logger.debug("photo lecturer", lecturerDoc?.photo);
    deleteImage(lecturerDoc?.photo || "").catch((err) => {
      logger.error("Error deleting lecturer image: ", err);
    });

    if (!lecturerDoc) {
      throw ApiError.notFound("Lecturer not found");
    }
    await this.model.deleteOne({ _id: id });
    const historyData: IHistoryInput = {
      action: "DELETE",
      entityId: new mongoose.Types.ObjectId(lecturerDoc.id),
      entity: "lecturer",
      user: currentUser?.id ?? null,
      description: `Lecturer ${lecturerDoc.username} deleted`,
    };

    await this.history.create(historyData);
    await this.cache.incr("lecturers:version");
    await this.cache.del(`lecturers:item:${id}`);

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }
}
