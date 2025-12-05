export class BaseService {
  constructor(model) {
    this.model = model;
  }

  /**
   * Generic get all with pagination
   */
  async getAll(query = {}) {
    const { page = 1, limit = 10, sort = "-createdAt", ...filters } = query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [data, total] = await Promise.all([
      this.model
        .find(filters)
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sort)
        .lean(),
      this.model.countDocuments(filters),
    ]);

    return {
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  async getById(id) {
    const data = await this.model.findById(id);
    return data;
  }

  async create(data) {
    const newData = await this.model.create(data);
    return newData;
  }

  async update(id, data) {
    const updated = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return updated;
  }

  async delete(id) {
    const data = await this.model.findById(id);

    if (!data) return null;

    // Soft delete if model has isActive field
    if ("isActive" in data) {
      data.isActive = false;
      await data.save();
      return data;
    }

    await this.model.findByIdAndDelete(id);
    return data;
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  async exists(filter) {
    return await this.model.exists(filter);
  }
}
