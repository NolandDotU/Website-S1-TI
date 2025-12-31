"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecturer_routes_1 = __importDefault(require("./lecturer/lecturer.routes"));
const announcement_routes_1 = __importDefault(require("./announcement/announcement.routes"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const highlight_routes_1 = __importDefault(require("./highlight/highlight.routes"));
const router = express_1.default.Router();
router.use("/lecturers", lecturer_routes_1.default);
router.use("/news", announcement_routes_1.default);
router.use("/auth", auth_routes_1.default);
router.use("/highlight", highlight_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map