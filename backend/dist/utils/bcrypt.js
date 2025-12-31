"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashingPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../config/env");
const hashingPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(env_1.env.SALT_BCRYPT);
    return await bcrypt_1.default.hash(password, salt);
};
exports.hashingPassword = hashingPassword;
const comparePassword = async (password, hashed) => {
    return await bcrypt_1.default.compare(password, hashed);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=bcrypt.js.map