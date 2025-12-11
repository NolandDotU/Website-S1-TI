import NewsModel from "../model/newsModel.js";

class NewsService {
  private model: typeof NewsModel;

  constructor() {
    this.model = NewsModel;
  }

  async create(data: any) {
    const newsDoc = await this.model.create(data);
    return newsDoc.toJSON();
  }

  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this.model.find().sort({ uploadDate: -1 }).skip(skip).limit(limit),
      this.model.countDocuments()
    ]);

    return {
      data: docs.map(doc => doc.toJSON()),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNext: skip + docs.length < total,
        hasPrev: Number(page) > 1
      }
    };
  }

  async getByCategory(category: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const filter = { category };
    
    const [docs, total] = await Promise.all([
      this.model.find(filter).sort({ uploadDate: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter)
    ]);

    return {
      data: docs.map(doc => doc.toJSON()),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNext: skip + docs.length < total,
        hasPrev: Number(page) > 1
      }
    };
  }

  async update(id: string, data: any) {
    const newsDoc = await this.model.findByIdAndUpdate(id, data, { new: true });
    if (!newsDoc) throw new Error("News not found");
    return newsDoc.toJSON();
  }

  async delete(id: string) {
    const newsDoc = await this.model.findByIdAndDelete(id);
    if (!newsDoc) throw new Error("News not found");
    return newsDoc.toJSON();
  }
}

export default NewsService;
