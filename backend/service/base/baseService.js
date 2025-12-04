// ============================================
// service/base/BaseService.js
// Base class untuk semua service (DRY principle)
// ============================================
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

  /**
   * Check if exists
   */
  async exists(filter) {
    return await this.model.exists(filter);
  }
}

// ============================================
// CONTOH PENGGUNAAN ALTERNATIF
// Dependency Injection Pattern
// ============================================

// Di controller atau route, bisa inject service
class LecturerController {
  constructor(lecturerService) {
    this.lecturerService = lecturerService;
  }

  async getAll(req, res, next) {
    try {
      const result = await this.lecturerService.getAll(req.query);
      res.json({
        success: true,
        message: "Lecturers retrieved successfully",
        data: result.data,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const lecturer = await this.lecturerService.getById(req.params.id);
      res.json({
        success: true,
        message: "Lecturer retrieved successfully",
        data: lecturer,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const lecturer = await this.lecturerService.create(req.body);
      res.status(201).json({
        success: true,
        message: "Lecturer created successfully",
        data: lecturer,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const lecturer = await this.lecturerService.update(
        req.params.id,
        req.body
      );
      res.json({
        success: true,
        message: "Lecturer updated successfully",
        data: lecturer,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await this.lecturerService.delete(req.params.id);
      res.json({
        success: true,
        message: "Lecturer deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const stats = await this.lecturerService.getDepartmentStatistics();
      res.json({
        success: true,
        message: "Statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export controller dengan dependency injection
export const lecturerController = new LecturerController(LecturerService);

// ============================================
// TESTING EXAMPLES
// ============================================

// Test 1: Direct service usage
console.log("=== Test Direct Service ===");
const lecturer1 = {
  name: "Dr. John Doe",
  nip: "123456",
  email: "john@example.com",
  department: "Computer Science",
  position: "Profesor",
};

// lecturerService.create(lecturer1).then(console.log);

// Test 2: Using factory
console.log("\n=== Test Service Factory ===");
const lecturerSvc = serviceFactory.get("lecturer");
console.log("Service from factory:", lecturerSvc === LecturerService);

// Test 3: Controller with DI
console.log("\n=== Test Controller with DI ===");
console.log("Controller initialized:", lecturerController);
