const mongoose = require("mongoose");
const utils = require("./utils");

const connect = async () => {
  try {
    await mongoose.connect(utils.getEnv("MONGO_URI"));
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = { connect };
