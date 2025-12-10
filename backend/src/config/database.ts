import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxIdleTimeMS: 10000,
  retryWrites: true,
  retryReads: true,
  dbName: env.MONGODB_NAME,
};

export const mongoConnect = async (retries = 5): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, options);
    logger.info("Connected to MongoDB");

    setupEventListener();
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    if (retries > 0) {
      logger.info(`Retrying ... (${retries} attempts left)`);
      return mongoConnect(retries - 1);
    }
    throw error;
  }
};
const setupEventListener = () => {
  mongoose.connection.on("connected", () =>
    logger.info("Connected to MongoDB")
  );
  mongoose.connection.on("disconnected", () =>
    logger.info("Disconnected from MongoDB")
  );
  mongoose.connection.on("error", (err) =>
    logger.error("MongoDB error: " + err.message)
  );

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info("Disconnected from MongoDB");
  } catch (error) {
    logger.error("Failed to disconnect from MongoDB:", error);
  }
};

export const getDBStatus = () => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState];
};
