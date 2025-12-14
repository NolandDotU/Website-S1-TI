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

    const cacheKey = `lecturers:page:${page}:limit:${limit}:search:${search}`;

    const cached = await this.cache.get<ILecturerResponse[]>(cacheKey);
    logger.info("Cached Lecturers", cached?.length);
    if (cached) return cached;

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
    await this.cache.set(cacheKey, result);

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
