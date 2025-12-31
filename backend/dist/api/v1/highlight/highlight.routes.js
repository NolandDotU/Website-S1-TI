"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const highlight_service_1 = __importDefault(require("./highlight.service"));
const express_1 = __importDefault(require("express"));
const rateLimiter_middleware_1 = require("../../../middleware/rateLimiter.middleware");
const validate_middleware_1 = require("../../../middleware/validate.middleware");
const highlight_dto_1 = require("./highlight.dto");
const router = express_1.default.Router();
let controller = null;
const getController = () => {
    if (controller == null) {
        controller = highlight_service_1.default;
    }
    return controller;
};
router.get("/", rateLimiter_middleware_1.globalLimiter, getController().getAll);
router.post("/", rateLimiter_middleware_1.globalLimiter, (0, auth_middleware_1.authMiddleware)(["admin"]), (0, validate_middleware_1.validate)(highlight_dto_1.CreateHighlightSchema), getController().create);
router.delete("/:id", rateLimiter_middleware_1.globalLimiter, (0, auth_middleware_1.authMiddleware)(["admin"]), getController().delete);
router.delete("/", rateLimiter_middleware_1.globalLimiter, (0, auth_middleware_1.authMiddleware)(["admin"]), getController().deleteAll);
exports.default = router;
//# sourceMappingURL=highlight.routes.js.map