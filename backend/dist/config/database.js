"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDBStatus = exports.disconnectDB = exports.mongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxIdleTimeMS: 10000,
    retryWrites: true,
    retryReads: true,
    dbName: env_1.env.MONGODB_NAME,
};
const mongoConnect = async (retries = 5) => {
    try {
        await mongoose_1.default.connect(env_1.env.MONGODB_URI, options);
        logger_1.logger.info("Connected to MongoDB");
        setupEventListener();
    }
    catch (error) {
        logger_1.logger.error("Failed to connect to MongoDB:", error);
        if (retries > 0) {
            logger_1.logger.info(`Retrying ... (${retries} attempts left)`);
            return (0, exports.mongoConnect)(retries - 1);
        }
        throw error;
    }
};
exports.mongoConnect = mongoConnect;
const setupEventListener = () => {
    mongoose_1.default.connection.on("connected", () => logger_1.logger.info("Connected to MongoDB"));
    mongoose_1.default.connection.on("disconnected", () => logger_1.logger.info("Disconnected from MongoDB"));
    mongoose_1.default.connection.on("error", (err) => logger_1.logger.error("MongoDB error: " + err.message));
    process.on("SIGINT", async () => {
        await mongoose_1.default.connection.close();
        process.exit(0);
    });
};
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        logger_1.logger.info("Disconnected from MongoDB");
    }
    catch (error) {
        logger_1.logger.error("Failed to disconnect from MongoDB:", error);
    }
};
exports.disconnectDB = disconnectDB;
const getDBStatus = () => {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    return states[mongoose_1.default.connection.readyState];
};
exports.getDBStatus = getDBStatus;
//# sourceMappingURL=database.js.map