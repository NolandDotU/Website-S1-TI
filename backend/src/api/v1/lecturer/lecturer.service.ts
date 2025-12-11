import { LecturerModel } from "../../../model/lecturerModel";
import {
  ILecturerDoc,
  ILecturerInput,
  ILecturerResponse,
  IUpdateInput,
} from "./lecturer.dto";
import { CacheManager, logger } from "../../../utils/index";
import { getRedisClient } from "../../../config/redis";

export class LecturerService {
  private model: typeof LecturerModel;
  private cache: CacheManager;

  constructor(model = LecturerModel, cache?: CacheManager) {
    this.model = model;
    // Only call getRedisClient() if cache is not provided
    this.cache = cache || new CacheManager(getRedisClient());
  }

  async create(data: ILecturerInput): Promise<ILecturerResponse> {
    const existing = await this.model.findOne({ email: data.email });
    if (existing) throw new Error("Email already exists");

    const lecturerDoc = await this.model.create(data);
    await this.cache.del("lecturers");

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }

  async getAll(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<{ data: ILecturerResponse[]; total: number }> {
    const skip = (page - 1) * limit;

    const cached = await this.cache.get("lecturers");
    logger.info("Lecturers fetched from database", { cached });
    if (cached) return cached;

    const [docs, total] = await Promise.all([
      this.model.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(),
    ]);

    logger.info("Lecturers fetched from database", { docs, total });

    const data = docs.map((ret: any) => {
      return ret as ILecturerResponse;
    });

    await this.cache.set("lecturers", { data, total });

    return { data, total };
  }

  async update(data: IUpdateInput): Promise<ILecturerResponse> {
    const lecturerDoc = await this.model.findOneAndUpdate(
      { _id: data.id },
      data,
      { new: true }
    );

    if (!lecturerDoc) throw new Error("Lecturer not found");

    await this.cache.del("lecturers");

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }

  async delete(id: string): Promise<ILecturerResponse> {
    const lecturerDoc = await this.model.findOneAndDelete({ _id: id });

    if (!lecturerDoc) throw new Error("Lecturer not found");

    await this.cache.del("lecturers");

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }
}
