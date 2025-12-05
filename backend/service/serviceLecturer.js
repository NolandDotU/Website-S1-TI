// ============================================
// service/LecturerService.js
// Specific implementation untuk Lecturer
// ============================================
import { BaseService } from "./base/baseService.js";
import LecturerModel from "../model/lecturerModel.js";
import { AppError } from "../middleware/errorHandler.js";

class LecturerService extends BaseService {
  constructor() {
    super(LecturerModel);
  }

  async getAll(query) {
    const { search, ...baseQuery } = query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const finalQuery = { ...filter, ...baseQuery };

    return await super.getAll(finalQuery);
  }

  async getById(id) {
    const lecturer = await super.getById(id);

    if (!lecturer) {
      throw new AppError("Lecturer not found", 404);
    }

    return lecturer;
  }

  async create(data) {
    const exists = await this.exists({
      $or: [{ email: data.email }],
    });

    if (exists) {
      throw new AppError("Lecturer with this email already exists", 400);
    }

    return await super.create(data);
  }

  async update(id, data) {
    const lecturer = await this.getById(id);

    if (data.nip || data.email) {
      const exists = await this.exists({
        _id: { $ne: id },
        $or: [
          ...(data.nip ? [{ nip: data.nip }] : []),
          ...(data.email ? [{ email: data.email }] : []),
        ],
      });

      if (exists) {
        throw new AppError(
          "Lecturer with this NIP or email already exists",
          400
        );
      }
    }

    return await super.update(id, data);
  }

  /**
   * Business logic specific methods
   */
  async getByDepartment(department) {
    return await this.model
      .find({
        department,
        isActive: true,
      })
      .lean();
  }

  async bulkCreate(lecturersData) {
    // Validate all before insert
    for (const data of lecturersData) {
      const exists = await this.exists({
        $or: [{ nip: data.nip }, { email: data.email }],
      });

      if (exists) {
        throw new AppError(
          `Lecturer with NIP ${data.nip} or email ${data.email} already exists`,
          400
        );
      }
    }

    return await this.model.insertMany(lecturersData);
  }

  async bulkUpdate(updates) {
    const bulkOps = updates.map(({ id, data }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: data },
      },
    }));

    return await this.model.bulkWrite(bulkOps);
  }

  async getDepartmentStatistics() {
    return await this.model.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          positions: { $push: "$position" },
        },
      },
      {
        $project: {
          department: "$_id",
          count: 1,
          positions: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);
  }
}

export default new LecturerService();
