import bcrypt from "bcrypt";
import { env } from "../config/env";

export const hashingPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(env.SALT_BCRYPT);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashed: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};
