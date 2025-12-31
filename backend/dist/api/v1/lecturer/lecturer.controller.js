"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerController = void 0;
const utils_1 = require("../../../utils");
const lecturer_service_1 = require("./lecturer.service");
class LecturerController {
    constructor(service = new lecturer_service_1.LecturerService()) {
        this.service = service;
        this.create = (0, utils_1.asyncHandler)(async (req, res) => {
            const lecturer = await this.service.create(req.body);
            utils_1.logger.info("Lecturer created successfully");
            res
                .status(201)
                .json(utils_1.ApiResponse.success(lecturer, "Lecturer created successfully", 201));
        });
        this.getAll = (0, utils_1.asyncHandler)(async (req, res) => {
            const { page, limit, search } = req.query;
            utils_1.logger.info("Query params: ", req.query);
            const lecturers = await this.service.getAll(page, limit, search);
            res
                .status(200)
                .json(utils_1.ApiResponse.success(lecturers, "Lecturers fetched successfully", 200));
        });
        this.update = (0, utils_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const lecturer = await this.service.update(req.body, id);
            return res.json(utils_1.ApiResponse.success(lecturer));
        });
        this.delete = (0, utils_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const lecturer = await this.service.delete(id);
            return res.json(utils_1.ApiResponse.success(lecturer));
        });
    }
}
exports.LecturerController = LecturerController;
//# sourceMappingURL=lecturer.controller.js.map