"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueSlug = exports.slugify = void 0;
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove non-word chars
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start
        .replace(/-+$/, ""); // Trim - from end
};
exports.slugify = slugify;
const uniqueSlug = (text) => {
    const slug = (0, exports.slugify)(text);
    const timestamp = Date.now().toString(36);
    return `${slug}-${timestamp}`;
};
exports.uniqueSlug = uniqueSlug;
//# sourceMappingURL=slugify.js.map