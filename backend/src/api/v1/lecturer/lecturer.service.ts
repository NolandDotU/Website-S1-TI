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
import { isCancel } from "axios";
import EmbeddingInsertService from "../embeddings/embeddingInsert.service";
import e from "express";

export class LecturerService {
  private model: typeof LecturerModel;
  private cache: CacheManager;
  private history: typeof historyService;

  private embedding = EmbeddingInsertService;

  constructor(model = LecturerModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient());
    this.history = historyService;
  }

  async create(
    data: ILecturerInput,
    currentUser: any,
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

    this.embedding.upsertOne(
      "lecturer",
      lecturerDoc._id.toString(),
      `${lecturerDoc.fullname}\n${lecturerDoc.email}\n${lecturerDoc.expertise}\n${lecturerDoc.externalLink}`,
    ).catch(err =>
      logger.error("Embedding Failed", lecturerDoc._id.toString(), err.massage)
    );

    return lecturerDoc.toJSON() as unknown as ILecturerResponse;
  }

  async getAll(
    page = 1,
    limit = 10,
    search = "",
  ): Promise<IPaginatedLecturerResponse> {
    const skip = (page - 1) * limit;
    let cacheKey = "";
    if (this.cache !== null) {
      const cacheVersion =
        (await this.cache.get<string>("lecturers:version")) || "0";
      const normalizedSearch = search.trim().toLowerCase();
      cacheKey = `lecturers:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;

      const cached = await this.cache.get<IPaginatedLecturerResponse>(cacheKey);
      if (cached) {
        logger.debug(`Cache HIT: ${cacheKey}`);
        return cached;
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

    const [docs, totalItems] = await Promise.all([
      this.model
        .find(searchQuery)
        .sort({ username: 1, _id: 1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(searchQuery),
    ]);

    const data = docs.map(
      (doc) => doc.toJSON() as unknown as ILecturerResponse,
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

    if (this.cache !== null) {
      await this.cache.set(cacheKey, result, 360); // 1 hour
    }

    return result;
  }

  async getAllActive(
    page = 1,
    limit = 10,
    search = "",
  ): Promise<IPaginatedLecturerResponse> {
    const skip = (page - 1) * limit;
    let cacheKey = "";
    if (this.cache !== null) {
      const cacheVersion =
        (await this.cache.get<string>("lecturers:active:version")) || "0";
      const normalizedSearch = search.trim().toLowerCase();
      cacheKey = `lecturers:active:v${cacheVersion}:p${page}:l${limit}:s${normalizedSearch}`;

      const cached = await this.cache.get<IPaginatedLecturerResponse>(cacheKey);
      if (cached) {
        logger.debug(`Cache HIT: ${cacheKey}`);
        return cached;
      }
    }

    const searchQuery = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
        isActive: true,
      }
      : {
        isActive: true,
      };

    const [docs, totalItems] = await Promise.all([
      this.model
        .find(searchQuery)
        .sort({ username: 1, _id: 1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(searchQuery),
    ]);

    const data = docs.map(
      (doc) => doc.toJSON() as unknown as ILecturerResponse,
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

    if (this.cache !== null) {
      await this.cache.set(cacheKey, result, 360); // 1 hour
    }

    return result;
  }

  async getByEmail(email: string): Promise<ILecturerResponse> {
    let cacheKey = "";
    if (this.cache !== null) {
      cacheKey = `lecturers:item:${email}`;

      const cached = await this.cache.get<ILecturerResponse>(cacheKey);
      if (cached) {
        logger.debug(`Cache HIT: ${cacheKey}`);
        return cached;
      }
    }

    const lecturerDoc = await this.model.findOne({ email: email });
    if (!lecturerDoc) {
      throw ApiError.notFound("Lecturer not found");
    }

    const data = lecturerDoc.toJSON() as unknown as ILecturerResponse;

    if (this.cache !== null) {
      await this.cache.set(cacheKey, data, 3600);
    }

    return data;
  }

  async update(
    data: ILecturerInput,
    id?: string,
    email?: string,
    currentUser?: any,
  ): Promise<ILecturerResponse> {
    try {
      if (!id && !email) {
        logger.error(
          `Missing parameters for updating lecturer ${id} || ${email}`,
        );
        throw ApiError.badRequest("Missing parameters");
      }
      const params = id ? { _id: id } : { email: email };
      const lecturer = await this.model.findOne(params);
      logger.info(`Updating lecturer with params: ${JSON.stringify(params)}`);
      logger.info(`LECTURER : ${lecturer}`);

      if (lecturer === null || lecturer === undefined) {
        throw ApiError.notFound("Lecturer not found");
      }
      if (data.photo) {
        deleteImage(lecturer.photo).catch((err) => {
          logger.error("Error deleting lecturer image: ", err);
        });
      }
      const lecturerDoc = await this.model.findOneAndUpdate(params, data, {
        new: true,
      });

      logger.info(`Updated lecturer: ${lecturerDoc}`);

      // if (!lecturerDoc) {
      //   logger.error(`Failed to update lecturer with ${lecturerDoc}`);
      //   throw ApiError.notFound("Failed to update lecturer");
      // }

      setImmediate(() => {
        const historyData: IHistoryInput = {
          action: "UPDATE",
          entityId: new mongoose.Types.ObjectId(lecturerDoc?.id),
          entity: "lecturer",
          user: currentUser?.id ?? null,
          description: `Lecturer ${data.username} updated by ${currentUser?.username}`,
        };
        this.history.create(historyData);
        this.cache.incr("lecturers:version");
        this.cache.del(`lecturers:item:${id}`);
        this.cache.del(`lecturers:item:${email}`);

        if (!lecturerDoc?._id) {
          logger.error("Missing lecturer _id for embedding");
          return;
        }
        this.embedding.upsertOne(
          "lecturer",
          lecturerDoc?._id.toString(),
          `${lecturerDoc?.fullname}\n${lecturerDoc?.email}\n${lecturerDoc?.expertise}\n${lecturerDoc?.externalLink}`,
        ).catch(err =>
          logger.error("Embedding update Failed", id, err.massage)
        );
      });

      return lecturerDoc?.toJSON() as unknown as ILecturerResponse;
    } catch (error) {
      logger.error("Error updating lecturer: ", error);
      throw error;
    }
  }

  async delete(id: string, currentUser?: any): Promise<ILecturerResponse> {
    const lecturerDoc = await this.model.findOne({
      _id: id,
    });

    logger.debug("photo lecturer", lecturerDoc?.photo);
    deleteImage(lecturerDoc?.photo || "").catch((err) => {
      logger.error("Error deleting lecturer image: ", err);
    });

    if (!lecturerDoc) {
      throw ApiError.notFound("Lecturer not found");
    }
    await this.model.deleteOne({ _id: id });

    this.embedding.deleteOne(
      "lecturer",
      id
    ).catch (err => 
      logger.error("Embedding delete Failed", id, err.message)
    );

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

  getStatistics = async (
    startOfMonth: Date,
    endOfMonth: Date,
    endOfLastMonth: Date,
  ) => {
    const [totalLecturer, currentMonthLecturer, lastMonthLecturer] =
      await Promise.all([
        this.model.countDocuments(),
        this.model.countDocuments({
          isActive: true,

          createdAt: {
            $gte: startOfMonth,
          },
        }),
        this.model.countDocuments({
          isActive: true,
          createdAt: {
            $gte: endOfLastMonth,
            $lte: endOfMonth,
          },
        }),
      ]);

    return {
      totalLecturer,
      currentMonthLecturer,
      lastMonthLecturer,
    };
  };
}
