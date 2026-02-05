import mongoose from "mongoose";
import UserModel from "../model/userModel";
import { logger } from "../utils";

export const seedAdmin = async () => {
  try {
    const data = {
      username: "admin",
      password: "admin123",
      role: "admin",
    };
    const exist = await UserModel.findOne({ username: data.username });
    if (exist) return;

    const seed = await UserModel.create(data);
    logger.info("Admin account created");
    return;
  } catch (error) {
    logger.error("Error seeding admin: ", error);
    throw error;
  }
};
