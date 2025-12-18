import { LecturerModel } from "../../../model/lecturerModel";
import { ILecturerInput, ILecturerResponse } from "./lecturer.dto";
import { CacheManager, logger, ApiError } from "../../../utils/index";
import { getRedisClient } from "../../../config/redis";

export class LecturerService {
  private model: typeof LecturerModel;
  private cache: CacheManager;

  constructor(model = LecturerModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient());
    // ✅ HAPUS this.cache.flush() - ini bahaya banget!
  }

  async create(data: ILecturerInput): Promise<ILecturerResponse> {
    const existing = await this.model.findOne({ email: data.email });
    if (existing) {
      throw ApiError.conflict("Lecturer already exists");
    }

    const lecturerDoc = await this.model.create(data);

    // ✅ Invalidate cache (safe, no-op kalau Redis mati)
    await this.cache.incr("lecturers:version");

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }

  async getAll(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<ILecturerResponse[]> {
    const skip = (page - 1) * limit;

    const cacheVersion =
      (await this.cache.get<string>("lecturers:version")) || "0";
    const normalizedSearch = search.trim().toLowerCase();
    const cacheKey = `lecturers:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;

    const cached = await this.cache.get<ILecturerResponse[]>(cacheKey);
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

    const docs = await this.model
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const data = docs.map(
      (doc) => doc.toJSON() as unknown as ILecturerResponse
    );

    await this.cache.set(cacheKey, data, 3600); // 1 hour

    return data;
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

  async update(data: ILecturerInput, id?: string): Promise<ILecturerResponse> {
    if (!id) {
      throw ApiError.badRequest("Lecturer ID is required");
    }

    const lecturerDoc = await this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    if (!lecturerDoc) {
      throw ApiError.notFound("Lecturer not found");
    }

    await this.cache.incr("lecturers:version");
    await this.cache.del(`lecturers:item:${id}`);

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }

  async delete(id: string): Promise<ILecturerResponse> {
    const lecturerDoc = await this.model.findOneAndDelete({
      $or: [{ _id: id }, { email: id }],
    });

    if (!lecturerDoc) {
      throw ApiError.notFound("Lecturer not found");
    }

    await this.cache.incr("lecturers:version");
    await this.cache.del(`lecturers:item:${id}`);

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }
}
