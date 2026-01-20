import { getRedisClient } from "../../../config/redis";
import PartnersModel from "../../../model/partnersModel";
import { CacheManager, logger, JWTPayload, ApiError } from "../../../utils";
import historyService from "../../../utils/history";
import { PartnerDTO } from "./partner.dto";

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

  newPartner = async (data: InputPartnerDTO, user: JWTPayload) => {};
}
