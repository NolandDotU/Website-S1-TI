import { LecturerModel } from "../../../model/lecturerModel";
import {
  ILecturerDoc,
  ILecturerInput,
  ILecturerResponse,
} from "./lecturer.dto";
import { CacheManager, logger } from "../../../utils/index";
import { getRedisClient } from "../../../config/redis";
import { ApiError } from "../../../utils";

export class LecturerService {
  private model: typeof LecturerModel;
  private cache: CacheManager;

  constructor(model = LecturerModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient());
    this.cache.flush();
  }

  async create(data: ILecturerInput): Promise<ILecturerResponse> {
    const existing = await this.model.findOne({ email: data.email });
    if (existing) throw ApiError.conflict("Lecturer already exists");

    const lecturerDoc = await this.model.create(data);
    await this.cache.del("lecturers");

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }

  async getAll(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<ILecturerResponse[]> {
    const skip = (page - 1) * limit;
    let cacheKey = "";

    if (this.cache) {
      try {
        const cacheVersion = (await this.cache.get("lecturers:version")) || "0";
        const normalizedSearch = search.trim().toLowerCase();
        cacheKey = `lecturers:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;
        logger.info("Cache Key", cacheKey);

        const cached = await this.cache.get<ILecturerResponse[]>(cacheKey);
        if (cached) {
          logger.info("Cache HIT - Returning cached lecturers", cached.length);
          return cached;
        }
        logger.info("Cache MISS - Fetching from database");
      } catch (error) {
        logger.error("Cache error, falling back to database", error);
      }
    }

    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const docs = await this.model
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const data = docs.map((doc) => {
      return doc.toJSON() as unknown as ILecturerResponse;
    });

    const result = data;
    if (this.cache && cacheKey) {
      try {
        await this.cache.set(cacheKey, data); // 1 hour TTL
        logger.info("Cached news data", data.length);
      } catch (error) {
        logger.error("Failed to cache data", error);
      }
    }

    return result;
  }

  async update(data: ILecturerInput, id?: string): Promise<ILecturerResponse> {
    const lecturerDoc = await this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    if (!lecturerDoc) throw new Error("Lecturer not found");

    await this.cache.del("lecturers");

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }

  async delete(params: string): Promise<ILecturerResponse> {
    const lecturerDoc = await this.model.findOneAndDelete({
      $or: [{ _id: params }, { email: params }],
    });

    if (!lecturerDoc) throw new Error("Lecturer not found");

    await this.cache.del("lecturers");

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }
}
