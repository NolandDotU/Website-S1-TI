"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationMeta = exports.getPagination = void 0;
const getPagination = (params) => {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;
    return { skip, limit, page };
};
exports.getPagination = getPagination;
const getPaginationMeta = (page, limit, total) => {
    return {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
    };
};
exports.getPaginationMeta = getPaginationMeta;
//# sourceMappingURL=pagination.js.map