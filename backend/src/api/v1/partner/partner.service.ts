import mongoose from "mongoose";
import { getRedisClient } from "../../../config/redis";
import { IHistoryInput } from "../../../model/historyModels";
import PartnersModel from "../../../model/partnersModel";
import { CacheManager, logger, JWTPayload, ApiError } from "../../../utils";
import historyService from "../../../utils/history";
import { PartnerDTO, ResponsePartnerDTO } from "./partner.dto";
import { deleteImage } from "../../../middleware/uploads.middleware";

export class PartnerService {
  private model: typeof PartnersModel;
  private cache: CacheManager | null;
  private history: typeof historyService;
  constructor(
    model = PartnersModel,
    cache?: CacheManager,
    history?: typeof historyService,
  ) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient());
    this.history = history || historyService;
  }

  getAllPartners = async () => {
    let cacheKey = "";
    if (this.cache !== null) {
      const cacheVersion =
        (await this.cache.get<string>("partner:version")) || "0";
      if (cacheVersion) cacheKey = `partner:v${cacheVersion}`;
      const cached = await this.cache.get<ResponsePartnerDTO[]>(cacheKey);
      if (cached) return cached;
    }
    const partners = await this.model.find().sort({ createdAt: -1 });
    logger.info("partners : ", partners);

    setImmediate(() => {
      if (this.cache !== null) {
        this.cache.set(cacheKey, partners, 300);
      }
    });
  };

  newPartner = async (data: PartnerDTO, user: JWTPayload) => {
    try {
      const newPartner = await this.model.create(data);
      setImmediate(() => {
        const historyData: IHistoryInput = {
          action: "POST",
          entity: "partner",
          entityId: newPartner.id,
          description: `Menambahkan partner baru: ${data.company}`,
          user: user.id as unknown as mongoose.Types.ObjectId,
        };
        this.history.create(historyData);
        if (this.cache !== null) {
          this.cache.incr("partner:version");
        }
      });
      return newPartner;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ApiError(409, "Partner sudah terdaftar");
      }
      throw error;
    }
  };

  editPartner = async (id: string, data: PartnerDTO, user: JWTPayload) => {
    const partner = await this.model.findById(id);
    if (!partner) {
      throw ApiError.notFound("Partner tidak ditemukan");
    }

    logger.info(`data.image: ${data.image}, partner.image: ${partner.image}`);
    if (data.image !== "" && data.image !== null && data.image !== undefined) {
      logger.info(
        `Menghapus gambar lama ${partner.image} partner karena ada gambar baru ${data.image}`,
      );
      deleteImage(partner.image).catch((err) => {
        logger.error("Gagal menghapus gambar lama partner:", err);
      });
    }
    const updatedPartner = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
    setImmediate(() => {
      const historyData: IHistoryInput = {
        action: "UPDATE",
        entity: "partner",
        entityId: new mongoose.Types.ObjectId(id),
        description: `Mengubah data partner: ${data.company}`,
        user: new mongoose.Types.ObjectId(user.id),
      };
      this.history.create(historyData);
      if (this.cache !== null) {
        this.cache.incr("partner:version");
      }
    });
    return updatedPartner;
  };

  deletePartner = async (id: string, user: JWTPayload) => {
    const partner = await this.model.findById(id);
    if (partner?.image) {
      deleteImage(partner.image).catch((err) => {
        logger.error("Gagal menghapus gambar partner:", err);
      });
    }
    const deletedPartner = await this.model.findByIdAndDelete(id);
    if (!deletedPartner) {
      throw ApiError.notFound("Partner tidak ditemukan");
    }
    setImmediate(() => {
      const historyData: IHistoryInput = {
        action: "DELETE",
        entity: "partner",
        entityId: new mongoose.Types.ObjectId(id),
        description: `Menghapus partner: ${partner?.company}`,
        user: new mongoose.Types.ObjectId(user.id),
      };
      this.history.create(historyData);
      if (this.cache !== null) {
        this.cache.incr("partner:version");
      }
    });
    return deletedPartner;
  };
}
