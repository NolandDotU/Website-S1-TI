import { ApiError } from "../../../utils";
import { HighlightModel } from "../../../model/highlightModel";
import { CacheManager } from "../../../utils";
import { getRedisClient } from "../../../config/redis";

interface IHighlightInput {
  contentId: string;
}

class HighlightService {
  private model: typeof HighlightModel;
  private cache: CacheManager;

  constructor(model = HighlightModel, cache?: CacheManager) {
    this.model = model;
    this.cache = cache || new CacheManager(getRedisClient());
    this.cache.flush();
  }

  async create(data: IHighlightInput[]): Promise<any> {
    const count = await this.model.countDocuments();

    if (count + data.length > 4) {
      throw ApiError.conflict("Highlight limit exceeded (max 4)");
    }

    return await this.model.create(data);
  }

  async delete(id: string): Promise<any> {
    return await this.model.findByIdAndDelete(id);
  }

  async getAll(): Promise<any> {
    return await this.model
      .find({})
      .sort({ createdAt: -1 })
      .populate("contentId");
  }
}

const highlightService = new HighlightService();
export default highlightService;
