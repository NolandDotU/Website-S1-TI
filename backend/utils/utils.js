require("dotenv").config();

class Utils {
  static getEnv(key) {
    return process.env[key];
  }
}
